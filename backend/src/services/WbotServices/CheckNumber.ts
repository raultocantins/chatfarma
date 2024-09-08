import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
export function RemoverDigito9(numero: string) {
  // Verifica se o número tiver mais que 12 caracteres e começar com "55" seguido de dois dígitos de DDD e o dígito "9"
  const regex = /^55(\d{2})9/;
  // Se o número tiver mais que 12 caracteres e a regex encontrar uma correspondência, remove o dígito "9"
  if (numero.length > 12 && regex.test(numero)) {
    return numero.replace(regex, '55$1');
  } else {
    return numero;
  }
}
const CheckContactNumber = async (number: string): Promise<void> => {
  const correctedNumber = RemoverDigito9(number);

  const defaultWhatsapp = await GetDefaultWhatsApp();

  const wbot = getWbot(defaultWhatsapp.id);

  const validNumber: any = await wbot.getNumberId(`${correctedNumber}@${correctedNumber.length > 16 ? 'g.us' : 'c.us'}`);
  return validNumber.user
};

export default CheckContactNumber;
