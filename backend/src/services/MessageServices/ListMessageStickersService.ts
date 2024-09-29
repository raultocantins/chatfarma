import Sticker from "../../models/Sticker";

interface Response {
  stickers?: Sticker[];
}

const ListMessageStickersService = async (): Promise<Response> => {
  const { rows: stickers } = await Sticker.findAndCountAll();
  return {
    stickers:stickers
  };
};

export default ListMessageStickersService;
