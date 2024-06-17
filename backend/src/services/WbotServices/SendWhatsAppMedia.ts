
import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";
import * as Sentry from "@sentry/node";
import formatBody from "../../helpers/Mustache";
import mime from "mime";
import fs from "fs";
import path from "path";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import { exec } from "child_process";
interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
}

const publicFolder = path.resolve(__dirname, "..", "..", "..", "public");

const processAudio = async (audio: string): Promise<string> => {
  const outputAudio = `${publicFolder}/${new Date().getTime()}.mp3`;
  return new Promise((resolve, reject) => {
    exec(
      `${ffmpegPath.path} -i ${audio} -vn -ab 128k -ar 44100 -f ipod ${outputAudio} -y`,
      (error, _stdout, _stderr) => {
        if (error) reject(error);
        fs.unlinkSync(audio);
        resolve(outputAudio);
      }
    );
  });
};

const SendWhatsAppMedia = async ({
  media,
  ticket,
  body
}: Request): Promise<WbotMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);
    const hasBody = body
      ? formatBody(body as string, ticket)
      : undefined;

    const newMedia = MessageMedia.fromFilePath(media.path);
    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
      newMedia,
      {
        caption: hasBody,
        sendAudioAsVoice: true
      }
    );

    await ticket.update({ lastMessage: body || media.filename });

    fs.unlinkSync(media.path);

    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};


export default SendWhatsAppMedia;
