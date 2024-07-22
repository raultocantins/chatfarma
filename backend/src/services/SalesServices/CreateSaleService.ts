import Product from "../../models/Product";
import Sale from "../../models/Sale";

interface ProductItem {
  name: string;
  quantity: number;
  amount: number;
}
interface Data {
  statusId: number;
  userId: number;
  queueId?: number;
  contactId: number;
  products: ProductItem[]
}

const CreateSaleService = async (data: Data): Promise<void> => {

  try {
    const sale = await Sale.create({
      conditionId: data.statusId,
      userId: data.userId,
      contactId: data.contactId,
      queueId: data.queueId
    });
    for (const product of data.products) {
      await Product.create({ saleId: sale.id, name: product.name, quantity: product.quantity, amount: product.amount });
    }
  } catch (e) {
    throw new Error(e);
  }

};

export default CreateSaleService;
