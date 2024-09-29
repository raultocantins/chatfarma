import Sticker from "../../models/Sticker";

interface Request {
  name?: string;
  path?: string;
}

const SaveStickerService = async ({ name, path }: Request): Promise<void> => {
  await Sticker.upsert({ name, path });
};

export default SaveStickerService;
