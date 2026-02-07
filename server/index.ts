import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
import userRoute from "./routes/user.route";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import cors from "cors";
import restaurantRoute from "./routes/restaurant.route";
import menuRoute from "./routes/menu.route";
import orderRoute from "./routes/order.route";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

import { stripeWebhook } from "./controller/order.controller";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//default middleware for any mern project
app.post("/api/v1/order/extension/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true
}
app.use(cors(corsOptions))

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/order", orderRoute);


//http://localhost:8000/api/v1/user/signup

// Global error handler to catch Multer and other errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    // Non-multer errors (e.g., fileFilter) should return 400 with the message
    console.error(err);
    if (err instanceof Error) {
      return res.status(400).json({ success: false, message: err.message });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
  next();
});

// start server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});

