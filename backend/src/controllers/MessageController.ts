import { Request, Response } from "express";

import SetTicketMessagesAsRead from "../helpers/SetTicketMessagesAsRead";
import { getIO } from "../libs/socket";
import Message from "../models/Message";

import ListMessagesService from "../services/MessageServices/ListMessagesService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import DeleteWhatsAppMessage from "../services/WbotServices/DeleteWhatsAppMessage";
import SendWhatsAppMedia from "../services/WbotServices/SendWhatsAppMedia";
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage";
import SendWhatsAppContact from "../services/WbotServices/SendWhatsAppContact";
import SendWhatsAppSticker from "../services/WbotServices/SendWhatsAppSticker";
import ListMessageStickersService from "../services/MessageServices/ListMessageStickersService";
import SaveStickerService from "../services/MessageServices/SaveStickerService";

type IndexQuery = {
  pageNumber: string;
};

type MessageData = {
  body: string;
  fromMe: boolean;
  read: boolean;
  quotedMsg?: Message;
  contactNumber?: string;
  stickerPath?: string;
  name?: string;
  path?: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { pageNumber } = req.query as IndexQuery;

  const { count, messages, ticket, hasMore } = await ListMessagesService({
    pageNumber,
    ticketId
  });

  SetTicketMessagesAsRead(ticket);

  return res.json({ count, messages, ticket, hasMore });
};

export const getStickers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { stickers } = await ListMessageStickersService();
  return res.json({ stickers });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { body, quotedMsg }: MessageData = req.body;
  const medias = req.files as Express.Multer.File[];

  const ticket = await ShowTicketService(ticketId);

  SetTicketMessagesAsRead(ticket);

  if (medias) {
    await Promise.all(
      medias.map(async (media: Express.Multer.File) => {
        await SendWhatsAppMedia({ media, ticket });
      })
    );
  } else {
    await SendWhatsAppMessage({ body, ticket, quotedMsg });
  }

  return res.send();
};

export const sendSticker = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const { stickerPath }: MessageData = req.body;
  const ticket = await ShowTicketService(ticketId);
  console.log(req.body);
  SetTicketMessagesAsRead(ticket);

  await SendWhatsAppSticker({ ticket, stickerPath });
  return res.send();
};

export const storeSticker = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, path }: MessageData = req.body;

  await SaveStickerService({ name, path });
  return res.send();
};

export const storeContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const { contactNumber }: MessageData = req.body;
  const ticket = await ShowTicketService(ticketId);
  SetTicketMessagesAsRead(ticket);
  await SendWhatsAppContact({ ticket, contactNumber });
  return res.send();
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { messageId } = req.params;

  const message = await DeleteWhatsAppMessage(messageId);

  const io = getIO();
  io.to(message.ticketId.toString()).emit("appMessage", {
    action: "update",
    message
  });

  return res.send();
};
