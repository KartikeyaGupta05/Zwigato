import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  updateUserLocation,
} from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.get("/current-user", authMiddleware, getCurrentUser);
userRouter.post("/update-location", authMiddleware, updateUserLocation);

export default userRouter;
