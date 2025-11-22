import express from "express";
import {
  placeOrder,
  getMyOrders,
} from "../controllers/order.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", authMiddleware, placeOrder);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);

export default orderRouter;
