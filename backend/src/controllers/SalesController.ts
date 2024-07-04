import { Request, Response } from "express";
import ListSalesService from "../services/SalesServices/ListSalesService";
import CreateSaleService from "../services/SalesServices/CreateSaleService";
type IndexQuerySearch = {
  selectedUser?: string;
  startDate?: string;
  endDate?: string;
  pageNumber: string;
};

interface ProductItem {
  name: string;
  quantity: number;
  amount: number;
}
interface Data {
  statusId: number;
  userId: number;
  products: ProductItem[]
}


export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    selectedUser,
    startDate,
    endDate,
    pageNumber
  } = req.query as IndexQuerySearch;
  const sales = await ListSalesService(
    {
      selectedUser,
      startDate,
      endDate,
      pageNumber
    }
  );

  return res.status(200).json(sales);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const data: Data =
    req.body;

  const condition = await CreateSaleService(
    data
  );

  return res.status(200).json(condition);
};
