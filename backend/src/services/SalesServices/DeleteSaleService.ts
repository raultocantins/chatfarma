
import AppError from "../../errors/AppError";
import Sale from "../../models/Sale";

const DeleteSaleService = async (id: string): Promise<void> => {
  const sale = await Sale.findOne({
    where: { id }
  });
  if (!sale) {
    throw new AppError("ERR_NO_SALE_FOUND", 404);
  }
  await sale.destroy();
};

export default DeleteSaleService;