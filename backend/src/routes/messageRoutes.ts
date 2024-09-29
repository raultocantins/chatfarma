import { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";

import * as MessageController from "../controllers/MessageController";

const messageRoutes = Router();

const upload = multer(uploadConfig);

messageRoutes.get("/messages/:ticketId", isAuth, MessageController.index);

messageRoutes.get("/stickers", isAuth, MessageController.getStickers);

messageRoutes.post(
  "/messages/:ticketId",
  isAuth,
  upload.array("medias"),
  MessageController.store
);

messageRoutes.post(
  "/messages/sticker/:ticketId",
  isAuth,
  MessageController.sendSticker
);

messageRoutes.post("/stickers", isAuth, MessageController.storeSticker);

messageRoutes.post(
  "/messages/contact/:ticketId",
  isAuth,
  MessageController.storeContact
);

messageRoutes.delete("/messages/:messageId", isAuth, MessageController.remove);

export default messageRoutes;
