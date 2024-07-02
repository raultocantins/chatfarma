import { Request, Response } from "express";
import ListSalesService from "../services/SalesServices/ListSalesService";
import CreateSaleService from "../services/SalesServices/CreateSaleService";

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


export const index = async (_: Request, res: Response): Promise<Response> => {
  const sales = await ListSalesService();

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
