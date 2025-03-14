import { startOfDay, endOfDay, parseISO } from "date-fns";

import { Op, Filterable, fn, where, col, Includeable } from "sequelize";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";

import User from "../../models/User";
import Queue from "../../models/Queue";
import Contact from "../../models/Contact";
import Message from "../../models/Message";

interface Response {
  tickets: Ticket[];
}

interface Request {
  selectedTag?: string;
  selectedUser?: string;
  selectedQueue?: string;
  selectedStatus?: string;
  selectedContact?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}

const ListTicketsService = async ({
  selectedUser,
  selectedQueue,
  selectedStatus,
  selectedContact,
  startDate,
  endDate,
  keyword
}: Request): Promise<Response | undefined> => {
  let includeCondition: Includeable[];
  let whereCondition: Filterable["where"];
  includeCondition = [
    {
      model: User,
      as: "user",
      attributes: ["id", "name"]
    },
    {
      model: Queue,
      as: "queue",
      attributes: ["id", "name"]
    },
    {
      model: Contact,
      as: "contact",
      attributes: ["id", "name", "profilePicUrl"]
    }
  ];

  if (startDate && endDate) {
    whereCondition = {
      ...whereCondition,
      updatedAt: {
        [Op.between]: [
          +startOfDay(parseISO(startDate)),
          +endOfDay(parseISO(endDate))
        ]
      }
    };
  }
  if (keyword) {
    const sanitizedSearchParam = keyword.toLocaleLowerCase().trim();

    includeCondition = [
      ...includeCondition,
      {
        model: Message,
        as: "messages",
        attributes: ["id", "body"],
        where: {
          body: where(
            fn("LOWER", col("body")),
            "LIKE",
            `%${sanitizedSearchParam}%`
          )
        },
        required: false,
        duplicating: false
      }
    ];

    whereCondition = {
      ...whereCondition,
      [Op.or]: [
        {
          "$message.body$": where(
            fn("LOWER", col("body")),
            "LIKE",
            `%${sanitizedSearchParam}%`
          )
        }
      ]
    };
  }
  if (selectedUser) {
    whereCondition = { ...whereCondition, userId: selectedUser };
  }

  if (selectedQueue) {
    whereCondition = { ...whereCondition, queueId: selectedQueue };
  }

  if (selectedStatus) {
    whereCondition = { ...whereCondition, status: selectedStatus };
  }

  if (selectedContact) {
    whereCondition = { ...whereCondition, contactId: selectedContact };
  }

  whereCondition = {
    ...whereCondition,
    isGroup: { [Op.or]: [false, null] }
  };
  try {
    const tickets = await Ticket.findAll({
      include: includeCondition,
      where: whereCondition,
      limit: 30
    });

    return {
      tickets
    };
  } catch (err) {
    throw new AppError(err.message);
  }
};

export default ListTicketsService;
