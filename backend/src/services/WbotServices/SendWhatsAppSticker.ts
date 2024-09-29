import { MessageMedia, Message as WbotMessage } from "whatsapp-web.js";
import AppError from "../../errors/AppError";
import GetTicketWbot from "../../helpers/GetTicketWbot";
import Ticket from "../../models/Ticket";
interface Request {
  ticket: Ticket;
  stickerPath?: string;
}

const SendWhatsAppSticker = async ({
  ticket,
  stickerPath
}: Request): Promise<WbotMessage> => {
  try {
    const wbot = await GetTicketWbot(ticket);
    const newMedia = await MessageMedia.fromUrl(stickerPath ?? "");
    const sentMessage = await wbot.sendMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
      newMedia,
      {
        sendMediaAsSticker: true
      }
    );

    await ticket.update({ lastMessage: "Figurinha enviada" });
    return sentMessage;
  } catch (err) {
    throw new AppError("ERR_SENDING_WAPP_STICKER");
  }
};

export default SendWhatsAppSticker;
