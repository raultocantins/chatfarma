import { Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";

interface Request {
  ticket: Ticket;
  contactNumber?: string,
}

const SendWhatsAppContact = async ({
  ticket,
  contactNumber,
}: Request): Promise<WbotMessage> => {
  const wbot = await GetTicketWbot(ticket);
  try {
    const contactId = await wbot.getNumberId(contactNumber ?? '');
    if (!contactId) throw new AppError(`CONTACT_NOT_FOUND`);
    const contact = await wbot.getContactById(contactId._serialized);
    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
      contact
    );
    return sentMessage;
  } catch (err) {
    throw new AppError(err ?? "ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppContact;