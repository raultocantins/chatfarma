import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import ListService from "../services/CampaignSettingServices/ListService";
import CreateService from "../services/CampaignSettingServices/CreateService";

interface StoreData {
  settings: any;
}

export const index = async (req: Request, res: Response): Promise<Response> => {


  const records = await ListService({

  });

  return res.json(records);
};

export const store = async (req: Request, res: Response): Promise<Response> => {

  const data = req.body as StoreData;

  const record = await CreateService(data);

  const io = getIO();
  io.emit(`company-campaignSettings`, {
    action: "create",
    record
  });

  return res.status(200).json(record);
};
