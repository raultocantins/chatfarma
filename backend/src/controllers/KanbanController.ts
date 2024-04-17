import { Request, Response } from "express";
import KanbanService from "../services/KanbanServices/KanbanService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { tickets, users } = await KanbanService();

  return res.status(200).json({ tickets, users });
};
