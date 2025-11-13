import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }
    const user = await User.findOne({ _id: decoded.id }).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.id = user._id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
