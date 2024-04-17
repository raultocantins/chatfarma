import Queue from "../../models/Queue";

const ListQueuesDashService = async (): Promise<Queue[]> => {
  const queues = await Queue.findAll({
    order: [["name", "ASC"]],
    attributes: ["id", "name"]
  });

  return queues;
};

export default ListQueuesDashService;
