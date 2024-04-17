import { Op, Filterable, Includeable } from "sequelize";
import { startOfDay, endOfDay, parseISO } from "date-fns";

import Ticket from "../../models/Ticket";
import Queue from "../../models/Queue";
import User from "../../models/User";
import Contact from "../../models/Contact";

interface Request {
  dateRange?: string[];
  queueId?: string;
}

interface Response {
  tickets: Ticket[];
}

const ListTicketsDashService = async ({
  queueId,
  dateRange
}: Request): Promise<Response> => {
  let whereCondition: Filterable["where"];
  if (queueId !== "" && queueId !== null) {
    whereCondition = {
      queueId: queueId!
    };
  }
  let includeCondition: Includeable[];
  includeCondition = [
    {
      model: User,
      as: "user",
      attributes: ["id", "name"]
    },
    {
      model: Queue,
      as: "queue",
      attributes: ["id", "name", "color"]
    }
  ];

  if (dateRange) {
    whereCondition = {
      ...whereCondition,
      createdAt: {
        [Op.between]: [
          +startOfDay(parseISO(dateRange[0])),
          +endOfDay(parseISO(dateRange[1]))
        ]
      }
    };
  }

  whereCondition = {
    ...whereCondition,
    isGroup: { [Op.or]: [false, null] }
  };

  const { rows: tickets } = await Ticket.findAndCountAll({
    where: whereCondition,
    include: includeCondition,
    attributes: ["id", "status", "createdAt", "updatedAt"]
  });

  return {
    tickets
  };
};

export default ListTicketsDashService;
