import express from "express";
import isAuth from "../middleware/isAuth";

import * as KanbanController from "../controllers/KanbanController";

const kanbanRoutes = express.Router();

kanbanRoutes.get("/kanban", isAuth, KanbanController.index);

export default kanbanRoutes;
