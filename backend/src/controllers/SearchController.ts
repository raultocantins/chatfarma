import { Request, Response } from "express";
import AppError from "../errors/AppError";
import ListFiltersService from "../services/SearchServices/ListFiltersService";
import ListTicketsService from "../services/SearchServices/ListTicketsService";

type IndexQuerySearch = {
  selectedTag?: string;
  selectedUser?: string;
  selectedQueue?: string;
  selectedStatus?: string;
  selectedContact?: string;
  startDate?: string;
  endDate?: string;
};
export const index = async (req: Request, res: Response): Promise<Response> => {
  if (req.user.profile === "") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const filters = await ListFiltersService();

  return res.status(200).json(filters);
};

export const tickets = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user.profile === "") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const {
    selectedTag,
    selectedUser,
    selectedQueue,
    selectedStatus,
    selectedContact,
    startDate,
    endDate
  } = req.query as IndexQuerySearch;

  const ticketsFiltered = await ListTicketsService({
    selectedTag,
    selectedUser,
    selectedQueue,
    selectedStatus,
    selectedContact,
    startDate,
    endDate
  });

  return res.status(200).json(ticketsFiltered);
};
