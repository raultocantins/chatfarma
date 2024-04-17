import Tag from "../../models/Tag";
import User from "../../models/User";
import Queue from "../../models/Queue";
import AppError from "../../errors/AppError";

interface Response {
  tags: Tag[];
  users: User[];
  queues: Queue[];
}
const ListFiltersService = async (): Promise<Response | undefined> => {
  try {
    const tags = await Tag.findAll({
      attributes: ["id", "name"]
    });
    const users = await User.findAll({
      attributes: ["id", "name"]
    });
    const queues = await Queue.findAll({
      attributes: ["id", "name"]
    });

    return {
      tags,
      users,
      queues
    };
  } catch (err) {
    throw new AppError(err.message);
  }
};

export default ListFiltersService;
