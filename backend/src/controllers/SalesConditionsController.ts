import { Request, Response } from "express";
import ListSalesConditionService from "../services/SalesServices/ListSalesConditionService";
import CreateSalesConditionService from "../services/SalesServices/CreateSalesConditionService";

export const index = async (_: Request, res: Response): Promise<Response> => {
  const salesConditions = await ListSalesConditionService();

  return res.status(200).json(salesConditions);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { name } =
    req.body;

  const condition = await CreateSalesConditionService(
    name
  );

  return res.status(200).json(condition);
};
