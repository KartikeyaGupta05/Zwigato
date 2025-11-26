import express from "express";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", authMiddleware, placeOrder);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId", authMiddleware, updateOrderStatus);

export default orderRouter;
