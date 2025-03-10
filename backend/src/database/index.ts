import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import Queue from "../models/Queue";
import WhatsappQueue from "../models/WhatsappQueue";
import UserQueue from "../models/UserQueue";
import QuickAnswer from "../models/QuickAnswer";
import Tag from "../models/Tag";
import ContactTag from "../models/ContactTag";
import Integration from "../models/Integration";
import CampaignSetting from "../models/CampaignSetting";
import ContactList from "../models/ContactList";
import CampaignShipping from "../models/CampaignShipping";
import ContactListItem from "../models/ContactListItem";
import Campaign from "../models/Campaign";
import SalesCondition from "../models/SalesCondition";
import Sale from "../models/Sale";
import Product from "../models/Product";
import Sticker from "../models/Sticker";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  WhatsappQueue,
  UserQueue,
  QuickAnswer,
  Tag,
  ContactTag,
  Integration,
  CampaignSetting,
  CampaignShipping,
  ContactList,
  ContactListItem,
  Campaign,
  CampaignSetting,
  SalesCondition,
  Sale,
  Product,
  Sticker
];

sequelize.addModels(models);

export default sequelize;
