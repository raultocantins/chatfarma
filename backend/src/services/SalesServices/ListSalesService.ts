import { startOfDay, endOfDay, parseISO } from "date-fns";
import Product from "../../models/Product";
import Sale from "../../models/Sale";
import SalesCondition from "../../models/SalesCondition";
import { Op, Filterable } from "sequelize";
import User from "../../models/User";
import Contact from "../../models/Contact";
interface Request {
  selectedUser?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: string;
  queueId?: string;
}
interface Response {
  sales: Sale[];
  count: number;
  hasMore: boolean;
}

const ListSalesService = async ({
  selectedUser,
  startDate,
  endDate,
  pageNumber = "1",
  queueId
}: Request): Promise<Response> => {
  let whereCondition: Filterable["where"];

  if (startDate && endDate) {
    whereCondition = {
      ...whereCondition,
      createdAt: {
        [Op.between]: [
          +startOfDay(parseISO(startDate)),
          +endOfDay(parseISO(endDate))
        ]
      }
    };
  }
  if (queueId !== "" && queueId !== null) {
    whereCondition = {
      queueId: queueId!
    };
  }
  if (selectedUser) {
    whereCondition = { ...whereCondition, userId: parseInt(selectedUser) };
  }
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: sales } = await Sale.findAndCountAll({
    include: [
      { model: Product, as: 'productList', attributes: ["id", "name", "quantity", "amount"], },
      { model: SalesCondition, as: 'condition', attributes: ["id", "name"], },
      { model: User, as: 'user', attributes: ["id", "name"], },
      { model: Contact, as: 'contact', attributes: ["id", "name", "number"], }
    ], attributes: ["id", "createdAt"],
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  const hasMore = sales.length === limit && (offset + sales.length < count);
  return {
    sales,
    count,
    hasMore
  };
};

export default ListSalesService;
