import express from "express";
import {
  shopCreateController,
  shopUpdatedController,
  getMyShopController,
} from "../controllers/shop.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { body } from "express-validator";

const shopRouter = express.Router();
const shopValidation = [
  body("shopName").notEmpty().withMessage("Shop name is required"),
  body("state").notEmpty().withMessage("State is required"),
  body("city").notEmpty().withMessage("City is required"),
  body("address").notEmpty().withMessage("Address is required"),
];

shopRouter.post(
  "/create-shop",
  authMiddleware,
  upload.single("image"),
  shopValidation,
  shopCreateController
);
shopRouter.put(
  "/shop-update/:shopId",
  authMiddleware,
  upload.single("image"),
  shopValidation,
  shopUpdatedController
);

shopRouter.get("/get-myShop", authMiddleware, getMyShopController);
export default shopRouter;
