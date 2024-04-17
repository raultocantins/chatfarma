import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as SearchController from "../controllers/SearchController";

const searchRoutes = Router();

searchRoutes.get("/search/filters", isAuth, SearchController.index);
searchRoutes.get("/search/tickets", isAuth, SearchController.tickets);

export default searchRoutes;
