import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as SalesConditionsController from "../controllers/SalesConditionsController";

const salesConditionsRoutes = Router();

salesConditionsRoutes.get("/sales/conditions", isAuth, SalesConditionsController.index);

salesConditionsRoutes.post("/sales/conditions", isAuth, SalesConditionsController.store);


export default salesConditionsRoutes;
