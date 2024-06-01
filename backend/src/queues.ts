import * as Sentry from "@sentry/node";
import Queue from "bull";
import moment from "moment";
import { Identifier, Op } from "sequelize";
import { isEmpty, isNil, isArray } from "lodash";
import path from "path";
import { MessageData, SendMessage } from "./helpers/SendMessage";
import Whatsapp from "./models/Whatsapp";
import { logger } from "./utils/logger";
import Campaign from "./models/Campaign";
import ContactList from "./models/ContactList";
import ContactListItem from "./models/ContactListItem";
import CampaignSetting from "./models/CampaignSetting";
import CampaignShipping from "./models/CampaignShipping";
import GetWhatsappWbot from "./helpers/GetWhatsappWbot";
import { getMessageOptions } from "./services/WbotServices/SendWhatsAppMedia";
import { getIO } from "./libs/socket";
import { startOfDay, endOfDay, parseISO, addHours } from "date-fns";

const connection = process.env.REDIS_URI || "";
const limiterMax = process.env.REDIS_OPT_LIMITER_MAX || 1;
const limiterDuration = process.env.REDIS_OPT_LIMITER_DURATION || 3000;

interface ProcessCampaignData {
  id: number;
  delay: number;
}

interface PrepareContactData {
  contactId: number;
  campaignId: number;
  delay: number;
  variables: any[];
}

interface DispatchCampaignData {
  campaignId: number;
  campaignShippingId: number;
  contactListItemId: number;
}



export const messageQueue = new Queue("MessageQueue", connection, {
  limiter: {
    max: limiterMax as number,
    duration: limiterDuration as number,

  }
});

export const scheduleMonitor = new Queue("ScheduleMonitor", connection);
export const sendScheduledMessages = new Queue(
  "SendSacheduledMessages",
  connection
);

export const campaignQueue = new Queue("CampaignQueue", connection);

async function handleSendMessage(job: { data: any; }) {
  try {
    const { data } = job;

    const whatsapp = await Whatsapp.findByPk(data.whatsappId);

    if (whatsapp == null) {
      throw Error("Whatsapp não identificado");
    }

    const messageData: MessageData = data.data;

    await SendMessage(whatsapp, messageData);
  } catch (e: unknown) {
    Sentry.captureException(e);
    logger.error("MessageQueue -> SendMessage: error", (e as Error).message);
    throw e;
  }
}


async function handleVerifyCampaigns() {
  /**
   * @todo
   * Implementar filtro de campanhas
   */
  try {

    const now = new Date();
    const oneHourLater = addHours(now, 1);
    const campaigns = await Campaign.findAll({
      attributes: ['id', 'scheduledAt'],
      where: {
        scheduledAt: {
          [Op.between]: [
            +startOfDay(now),
            +endOfDay(oneHourLater)
          ]
        },
        status: 'PROGRAMADA'
      }
    });
    if (campaigns.length) {
      logger.info(`Campanhas encontradas: ${campaigns.length}`);
    }
    campaigns.forEach((campaign) => {
      try {
        const now = moment();
        const scheduledAt = moment(campaign.scheduledAt);
        const delay = scheduledAt.diff(now, "milliseconds");
        logger.info(
          `Campanha enviada para a fila de processamento: Campanha=${campaign.id}, Delay Inicial=${delay}`
        );
        campaignQueue.add(
          "ProcessCampaign",
          {
            id: campaign.id,
            delay
          },
          {
            removeOnComplete: true
          }
        );
      } catch (err: unknown) {
        Sentry.captureException(err);
      }
    });
  } catch (e) {
    logger.error(e);
  }

}

async function getCampaign(id: number) {
  try {
    return Campaign.findByPk(id, {
      include: [
        {
          model: ContactList,
          as: "contactList",
          attributes: ["id", "name"],
          include: [
            {
              model: ContactListItem,
              as: "contacts",
              attributes: ["id", "name", "number", "email", "isWhatsappValid"],
              where: { isWhatsappValid: true }
            }
          ]
        },
        {
          model: Whatsapp,
          as: "whatsapp",
          attributes: ["id", "name"]
        },
        {
          model: CampaignShipping,
          as: "shipping",
          include: [{ model: ContactListItem, as: "contact" }]
        }
      ]
    });
  } catch (e) {
    logger.error(e);
  }
}

async function getContact(id: Identifier | undefined) {

  return ContactListItem.findByPk(id, {
    attributes: ["id", "name", "number", "email"]
  });
}

async function getSettings(campaign: Campaign) {

  const settings = await CampaignSetting.findAll({
    attributes: ["key", "value"]
  });

  let messageInterval = 20;
  let longerIntervalAfter = 20;
  let greaterInterval = 60;
  let variables: any[] = [];

  settings.forEach(setting => {
    if (setting.key === "messageInterval") {
      messageInterval = JSON.parse(setting.value);
    }
    if (setting.key === "longerIntervalAfter") {
      longerIntervalAfter = JSON.parse(setting.value);
    }
    if (setting.key === "greaterInterval") {
      greaterInterval = JSON.parse(setting.value);
    }
    if (setting.key === "variables") {
      variables = JSON.parse(setting.value);
    }
  });

  return {
    messageInterval,
    longerIntervalAfter,
    greaterInterval,
    variables
  };
}

export function parseToMilliseconds(seconds: number) {

  return seconds * 1000;
}

export async function sleep(seconds: number) {

  logger.info(
    `Sleep de ${seconds} segundos iniciado: ${moment().format("HH:mm:ss")}`
  );
  return new Promise(resolve => {
    setTimeout(() => {
      logger.info(
        `Sleep de ${seconds} segundos finalizado: ${moment().format(
          "HH:mm:ss"
        )}`
      );
      resolve(true);
    }, parseToMilliseconds(seconds));
  });
}

function getCampaignValidMessages(campaign: Campaign) {

  const messages = [];

  if (!isEmpty(campaign.message1) && !isNil(campaign.message1)) {
    messages.push(campaign.message1);
  }

  if (!isEmpty(campaign.message2) && !isNil(campaign.message2)) {
    messages.push(campaign.message2);
  }

  if (!isEmpty(campaign.message3) && !isNil(campaign.message3)) {
    messages.push(campaign.message3);
  }

  if (!isEmpty(campaign.message4) && !isNil(campaign.message4)) {
    messages.push(campaign.message4);
  }

  if (!isEmpty(campaign.message5) && !isNil(campaign.message5)) {
    messages.push(campaign.message5);
  }

  return messages;
}

function getCampaignValidConfirmationMessages(campaign: Campaign) {

  const messages = [];

  if (
    !isEmpty(campaign.confirmationMessage1) &&
    !isNil(campaign.confirmationMessage1)
  ) {
    messages.push(campaign.confirmationMessage1);
  }

  if (
    !isEmpty(campaign.confirmationMessage2) &&
    !isNil(campaign.confirmationMessage2)
  ) {
    messages.push(campaign.confirmationMessage2);
  }

  if (
    !isEmpty(campaign.confirmationMessage3) &&
    !isNil(campaign.confirmationMessage3)
  ) {
    messages.push(campaign.confirmationMessage3);
  }

  if (
    !isEmpty(campaign.confirmationMessage4) &&
    !isNil(campaign.confirmationMessage4)
  ) {
    messages.push(campaign.confirmationMessage4);
  }

  if (
    !isEmpty(campaign.confirmationMessage5) &&
    !isNil(campaign.confirmationMessage5)
  ) {
    messages.push(campaign.confirmationMessage5);
  }

  return messages;
}

function getProcessedMessage(msg: string, variables: any[], contact: any) {

  let finalMessage = msg;

  if (finalMessage.includes("{nome}")) {
    finalMessage = finalMessage.replace(/{nome}/g, contact.name);
  }

  if (finalMessage.includes("{email}")) {
    finalMessage = finalMessage.replace(/{email}/g, contact.email);
  }

  if (finalMessage.includes("{numero}")) {
    finalMessage = finalMessage.replace(/{numero}/g, contact.number);
  }

  variables.forEach(variable => {
    if (finalMessage.includes(`{${variable.key}}`)) {
      const regex = new RegExp(`{${variable.key}}`, "g");
      finalMessage = finalMessage.replace(regex, variable.value);
    }
  });

  return finalMessage;
}

export function randomValue(min: number, max: number) {

  return Math.floor(Math.random() * max) + min;
}

async function verifyAndFinalizeCampaign(campaign: Campaign) {

  const { contacts } = campaign.contactList;

  const count1 = contacts.length;
  const count2 = await CampaignShipping.count({
    where: {
      campaignId: campaign.id,
      deliveredAt: {
        [Op.not]: null || undefined
      }
    }
  });

  if (count1 === count2) {
    await campaign.update({ status: "FINALIZADA", completedAt: moment() });
  }

  const io = getIO();
  io.emit(`company-campaign`, {
    record: campaign
  });
}

async function handleProcessCampaign(job: { data: ProcessCampaignData; }) {
  try {
    const { id }: ProcessCampaignData = job.data;
    let { delay }: ProcessCampaignData = job.data;
    const campaign = await getCampaign(id);
    if (!campaign) {
      throw new Error("Campaign is null or undefined");
    }

    const settings = await getSettings(campaign);
    if (campaign) {
      const { contacts } = campaign.contactList;
      if (isArray(contacts)) {
        let index = 0;
        contacts.forEach((contact) => {
          campaignQueue.add(
            "PrepareContact",
            {
              contactId: contact.id,
              campaignId: campaign.id,
              variables: settings.variables,
              delay: delay || 0
            },
            {
              removeOnComplete: true
            }
          );

          logger.info(
            `Registro enviado pra fila de disparo: Campanha=${campaign.id};Contato=${contact.name};delay=${delay}`
          );
          index += 1;
          if (index % settings.longerIntervalAfter === 0) {
            // intervalo maior após intervalo configurado de mensagens
            delay += parseToMilliseconds(settings.greaterInterval);
          } else {
            delay += parseToMilliseconds(
              randomValue(0, settings.messageInterval)
            );
          }
        });
        await campaign.update({ status: "EM_ANDAMENTO" });
      }
    }
  } catch (err: unknown) {
    logger.error(err);
    Sentry.captureException(err);
  }
}

async function handlePrepareContact(job: { data: PrepareContactData; }) {

  try {
    const { contactId, campaignId, delay, variables } = job.data;
    const campaign = await getCampaign(campaignId);
    const contact = await getContact(contactId);

    const campaignShipping: any = {};
    campaignShipping.number = contact?.number;
    campaignShipping.contactId = contactId;
    campaignShipping.campaignId = campaignId;
    if (!campaign) {
      throw new Error("Campaign is null or undefined");
    }

    const messages = getCampaignValidMessages(campaign);
    if (messages.length) {
      const radomIndex = randomValue(0, messages.length);
      const message = getProcessedMessage(
        messages[radomIndex],
        variables,
        contact
      );
      campaignShipping.message = `\u200c${message}`;
    }

    if (campaign?.confirmation) {
      const confirmationMessages =
        getCampaignValidConfirmationMessages(campaign);
      if (confirmationMessages.length) {
        const radomIndex = randomValue(0, confirmationMessages.length);
        const message = getProcessedMessage(
          confirmationMessages[radomIndex],
          variables,
          contact
        );
        campaignShipping.confirmationMessage = `\u200c${message}`;
      }
    }

    const [record, created] = await CampaignShipping.findOrCreate({
      where: {
        campaignId: campaignShipping.campaignId,
        contactId: campaignShipping.contactId
      },
      defaults: campaignShipping
    });

    if (
      !created &&
      record.deliveredAt === null &&
      record.confirmationRequestedAt === null
    ) {
      record.set(campaignShipping);
      await record.save();
    }

    if (
      record.deliveredAt === null &&
      record.confirmationRequestedAt === null
    ) {
      const nextJob = await campaignQueue.add(
        "DispatchCampaign",
        {
          campaignId: campaign?.id,
          campaignShippingId: record.id,
          contactListItemId: contactId
        },
        {
          delay
        }
      );

      await record.update({ jobId: `${nextJob.id}` });
    }
    if (!campaign) {
      throw new Error("Campaign is null or undefined");
    }

    await verifyAndFinalizeCampaign(campaign);
  } catch (err: unknown) {
    Sentry.captureException(err);
    logger.error(`campaignQueue -> PrepareContact -> error: ${(err as Error).message}`);
  }
}

async function handleDispatchCampaign(job: { data: any; }) {
  try {
    const { data } = job;
    const { campaignShippingId, campaignId }: DispatchCampaignData = data;
    const campaign = await getCampaign(campaignId);
    if (!campaign) {
      throw new Error("Campaign is null or undefined");
    }

    const wbot = await GetWhatsappWbot(campaign.whatsapp);

    logger.info(
      `Disparo de campanha solicitado: Campanha=${campaignId};Registro=${campaignShippingId}`
    );

    const campaignShipping = await CampaignShipping.findByPk(
      campaignShippingId,
      {
        include: [{ model: ContactListItem, as: "contact" }]
      }
    );

    if (!campaignShipping) {
      throw new Error("Campaign is null or undefined");
    }

    const chatId = `${campaignShipping.number}@c.us`;

    if (campaign.confirmation && campaignShipping.confirmation === null) {

      await wbot.sendMessage(chatId, campaignShipping.confirmationMessage);
      await campaignShipping.update({ confirmationRequestedAt: moment() });

    } else {

      await wbot.sendMessage(chatId, campaignShipping.message);
      if (campaign.mediaPath) {
        const filePath = path.resolve("public", campaign.mediaPath);
        const options = await getMessageOptions(campaign.mediaName, filePath);
        if (Object.keys(options).length) {
          await wbot.sendMessage(chatId, { ...options });
        }
      }
      await campaignShipping.update({ deliveredAt: moment() });

    }

    await verifyAndFinalizeCampaign(campaign);

    const io = getIO();
    io.emit(`company-campaign`, {
      action: "update",
      record: campaign
    });

    logger.info(
      `Campanha enviada para: Campanha=${campaignId};Contato=${campaignShipping.contact.name}`
    );
  } catch (err: unknown) {

    Sentry.captureException(err);
    logger.error((err as Error).message);
  }
}


export async function startQueueProcess() {
  logger.info("Iniciando processamento de filas");

  messageQueue.process("SendMessage", handleSendMessage);

  campaignQueue.process("VerifyCampaignsDaatabase", handleVerifyCampaigns);

  campaignQueue.process("ProcessCampaign", handleProcessCampaign);

  campaignQueue.process("PrepareContact", handlePrepareContact);

  campaignQueue.process("DispatchCampaign", handleDispatchCampaign);


  campaignQueue.add(
    "VerifyCampaignsDaatabase",
    {},
    {
      repeat: { cron: "*/20 * * * * *" },
      removeOnComplete: true
    }
  );

}
