import * as Yup from "yup";
import AppError from "../../errors/AppError";
import ContactListItem from "../../models/ContactListItem";
import { logger } from "../../utils/logger";
import CheckContactNumber, { RemoverDigito9 } from "../WbotServices/CheckNumber";

interface Data {
  name: string;
  number: string;
  contactListId: number;
  email?: string;
}

const CreateService = async (data: Data): Promise<ContactListItem> => {
  const { name } = data;

  const contactListItemSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "ERR_CONTACTLISTITEM_INVALID_NAME")
      .required("ERR_CONTACTLISTITEM_REQUIRED")
  });

  try {
    await contactListItemSchema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const [record] = await ContactListItem.findOrCreate({
    where: {
      number: data.number,
      contactListId: data.contactListId
    },
    defaults: data
  });

  try {
    const response = await CheckContactNumber(record.number);
    record.isWhatsappValid = response != null;
    record.number = RemoverDigito9(record.number);
    await record.save();
  } catch (e) {
    logger.error(`Número de contato inválido: ${record.number}`);
  }

  return record;
};

export default CreateService;
