import dotenv from "dotenv";
dotenv.config();
import("./services/database");

import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";


import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import productRouter from "./routes/productRoutes";
import categoryRouter from "./routes/categoryRoutes";
import orderRouter from "./routes/orderRoutes";

import { errorHandler } from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 9090;
const FE_URI = process.env.FE_URI;

const corsOptions = {
	origin: FE_URI,
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", productRouter);
app.use("/api", categoryRouter);
app.use("/api", orderRouter);

app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
