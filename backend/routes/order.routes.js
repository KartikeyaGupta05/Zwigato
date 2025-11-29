import express from "express";
import {
  placeOrder,
  verifyPayment,
  getMyOrders,
  updateOrderStatus,
  getDeliveryBoyAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  getTodayDeliveries,
} from "../controllers/order.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", authMiddleware, placeOrder);
orderRouter.post("/verify-payment",authMiddleware,verifyPayment);
orderRouter.get("/my-orders", authMiddleware, getMyOrders);
orderRouter.get("/get-assignments", authMiddleware, getDeliveryBoyAssignment);
orderRouter.get("/get-current-order", authMiddleware, getCurrentOrder);
orderRouter.post("/send-delivery-otp", authMiddleware, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", authMiddleware, verifyDeliveryOtp);
orderRouter.get('/get-today-deliveries',authMiddleware,getTodayDeliveries)
orderRouter.post(
  "/update-status/:orderId/:shopId",
  authMiddleware,
  updateOrderStatus
);
orderRouter.get("/accept-order/:assignmentId", authMiddleware, acceptOrder);
orderRouter.get("/get-order-by-id/:orderId", authMiddleware, getOrderById);

export default orderRouter;
