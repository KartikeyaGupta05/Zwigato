import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectToDb from "./db/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import itemRoutes from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
connectToDb();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/order", orderRouter);

export default app;
