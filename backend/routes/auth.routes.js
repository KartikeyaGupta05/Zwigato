import express from "express";
const router = express.Router();
import { body } from "express-validator";
import { registerUser, loginUser, logoutUser, sendOtp, verifyOtp, resetPassword } from "../controllers/auth.controllers.js";

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
            .isIn(["User", "Restaurent Owner", "Delivery Boy"])
            .withMessage("Role must be either User, Restaurent Owner, or Delivery Boy"),
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

router.post(
    "/send-otp",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
    ],
    sendOtp
);

router.post(
    "/verify-otp",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    ],
    verifyOtp
);

router.post(
    "/reset-password",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("newPassword")
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters long"),
    ],
    resetPassword
);

export default router;