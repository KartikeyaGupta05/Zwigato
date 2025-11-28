import express from "express";
import {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getDeliveryBoyAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
} from "../controllers/order.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", authMiddleware, placeOrder);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId", authMiddleware, updateOrderStatus);
orderRouter.get("/get-assignments", authMiddleware, getDeliveryBoyAssignment);
orderRouter.get('/accept-order/:assignmentId', authMiddleware, acceptOrder);
orderRouter.get("/get-current-order", authMiddleware, getCurrentOrder);
orderRouter.get('/get-order-by-id/:orderId', authMiddleware, getOrderById);

export default orderRouter;
