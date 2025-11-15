import express from "express";
import {
  itemCreateController,
  itemUpdatedController,
  getItemById,
  deleteItem,
  getItemsByCity,
} from "../controllers/item.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { body } from "express-validator";

const itemRouter = express.Router();
const itemValidation = [
  body("foodName").notEmpty().withMessage("Food name is required"),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("category").notEmpty().withMessage("Category is required"),
  body("foodType").notEmpty().withMessage("Food type is required"),
];

itemRouter.post(
  "/add-item",
  authMiddleware,
  upload.single("image"),
  itemValidation,
  itemCreateController
);
itemRouter.put(
  "/edit-item/:itemId",
  authMiddleware,
  upload.single("image"),
  itemValidation,
  itemUpdatedController
);

itemRouter.get("/getItem-by-id/:itemId", authMiddleware, getItemById);
itemRouter.delete("/delete-item/:itemId", authMiddleware, deleteItem);
itemRouter.get("/getItems-by-city/:city",authMiddleware, getItemsByCity);

export default itemRouter;
