import { Request, Response } from "express";
import ListSalesService from "../services/SalesServices/ListSalesService";
import CreateSaleService from "../services/SalesServices/CreateSaleService";
import DeleteSaleService from "../services/SalesServices/DeleteSaleService";
type IndexQuerySearch = {
  selectedUser?: string;
  startDate?: string;
  endDate?: string;
  pageNumber: string;
  queueId?: string;
};

interface ProductItem {
  name: string;
  quantity: number;
  amount: number;
}
interface Data {
  statusId: number;
  userId: number;
  contactId: number;
  products: ProductItem[]
}


export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    selectedUser,
    startDate,
    endDate,
    pageNumber,
    queueId
  } = req.query as IndexQuerySearch;
  const sales = await ListSalesService(
    {
      selectedUser,
      startDate,
      endDate,
      pageNumber,
      queueId
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



export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { saleId } = req.params;
  await DeleteSaleService(saleId);

  return res.status(200).json({ message: "sale deleted" });
};
