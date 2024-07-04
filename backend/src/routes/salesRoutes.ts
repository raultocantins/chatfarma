import { Router } from "express";
import isAuth from "../middleware/isAuth";

import * as SalesController from "../controllers/SalesController";

const salesRoutes = Router();

salesRoutes.get("/sales", isAuth, SalesController.index);

salesRoutes.post("/sales", isAuth, SalesController.store);

salesRoutes.delete("/sales/:saleId", isAuth, SalesController.remove);

export default salesRoutes;
