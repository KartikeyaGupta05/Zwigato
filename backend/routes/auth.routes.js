import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controllers.js";

router.post(
    "/register",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
        body("contact").notEmpty().withMessage("Contact number is required"),
        body("role")
            .isIn(["user", "owner", "deliveryBoy"])
            .withMessage("Role must be either user, owner, or deliveryBoy"),
    ],
    registerUser
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    loginUser
);

router.get("/logout", logoutUser);

export default router;