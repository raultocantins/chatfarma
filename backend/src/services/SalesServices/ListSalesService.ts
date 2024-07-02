import Product from "../../models/Product";
import Sale from "../../models/Sale";
import SalesCondition from "../../models/SalesCondition";
import User from "../../models/User";

const ListSalesService = async (): Promise<Sale[]> => {
  const sales = await Sale.findAll({
    include: [
      { model: Product, as: 'productList', attributes: ["id", "name", "quantity", "amount"], },
      { model: SalesCondition, as: 'condition', attributes: ["id", "name"], },
      { model: User, as: 'user', attributes: ["id", "name"], }
    ], attributes: ["id", "createdAt"]
  });

  return sales;
};

export default ListSalesService;
