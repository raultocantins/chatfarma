import { Router } from "express";

import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import settingRoutes from "./settingRoutes";
import contactRoutes from "./contactRoutes";
import ticketRoutes from "./ticketRoutes";
import whatsappRoutes from "./whatsappRoutes";
import messageRoutes from "./messageRoutes";
import whatsappSessionRoutes from "./whatsappSessionRoutes";
import queueRoutes from "./queueRoutes";
import quickAnswerRoutes from "./quickAnswerRoutes";
import apiRoutes from "./apiRoutes";
import tagRoutes from "./tagRoutes";
import integrationRoutes from "./integrationRoutes";
import systemRoutes from "./systemRoutes";
import searchRoutes from "./searchRoutes";
import contactListRoutes from "./contactListRoutes";
import contactListItemRoutes from "./contactListItemRoutes";
import campaignRoutes from "./campaignRoutes";
import campaignSettingRoutes from "./campaignSettingRoutes";
import salesConditionsRoutes from "./salesConditionsRoutes";
import salesRoutes from "./salesRoutes";

const routes = Router();

routes.use(userRoutes);
routes.use("/auth", authRoutes);
routes.use(settingRoutes);
routes.use(contactRoutes);
routes.use(ticketRoutes);
routes.use(whatsappRoutes);
routes.use(messageRoutes);
routes.use(whatsappSessionRoutes);
routes.use(queueRoutes);
routes.use(quickAnswerRoutes);
routes.use("/api/messages", apiRoutes);
routes.use(tagRoutes);
routes.use(integrationRoutes);
routes.use(systemRoutes);
routes.use(searchRoutes);
routes.use(contactListRoutes);
routes.use(contactListItemRoutes);
routes.use(campaignRoutes);
routes.use(campaignSettingRoutes);
routes.use(salesConditionsRoutes);
routes.use(salesRoutes);

export default routes;
