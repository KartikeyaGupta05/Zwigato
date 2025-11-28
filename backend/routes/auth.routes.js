import express from "express";
const authRouter = express.Router();
import { body } from "express-validator";
import { registerUser, loginUser, logoutUser, sendOtp, verifyOtp, resetPassword, googleAuthRegister, googleAuthLogin } from "../controllers/auth.controllers.js";

authRouter.post(
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
            .withMessage("Role must be either User, Owner, or Delivery Boy"),
    ],
    registerUser
);

authRouter.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("password")
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long"),
    ],
    loginUser
);

authRouter.get("/logout", logoutUser);

authRouter.post(
    "/send-otp",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
    ],
    sendOtp
);

authRouter.post(
    "/verify-otp",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    ],
    verifyOtp
);

authRouter.post(
    "/reset-password",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("newPassword")
            .isLength({ min: 6 })
            .withMessage("New password must be at least 6 characters long"),
    ],
    resetPassword
);

authRouter.post(
    "/google-auth-register",
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Please provide a valid email"),
        body("contact").notEmpty().withMessage("Contact number is required"),
        body("role")
            .isIn(["user", "owner", "deliveryBoy"])
            .withMessage("Role must be either User, Owner, or Delivery Boy"),
    ],
    googleAuthRegister
);

authRouter.post(
    "/google-auth-login",
    [
        body("email").isEmail().withMessage("Please provide a valid email"),
    ],
    googleAuthLogin
);      

export default authRouter;