import { Op, Filterable, Includeable } from "sequelize";
import { startOfDay, endOfDay, parseISO } from "date-fns";

import Ticket from "../../models/Ticket";
import User from "../../models/User";
import Contact from "../../models/Contact";

interface Response {
  tickets: Ticket[];
  users: User[];
}

const KanbanService = async (): Promise<Response> => {
  let whereCondition: Filterable["where"];

  let includeCondition: Includeable[];
  includeCondition = [
    {
      model: Contact,
      as: "contact",
      attributes: ["id", "name"]
    }
  ];

  whereCondition = {
    ...whereCondition,
    isGroup: { [Op.or]: [false, null] }
  };

  whereCondition = {
    ...whereCondition,
    status: { [Op.or]: ["open", "pending"] }
  };

  const { rows: tickets } = await Ticket.findAndCountAll({
    where: whereCondition,
    include: includeCondition,
    attributes: ["id", "status", "createdAt", "lastMessage"]
  });

  const { rows: users } = await User.findAndCountAll({
    attributes: ["id", "name", "status"]
  });

  return {
    tickets,
    users
  };
};

export default KanbanService;
