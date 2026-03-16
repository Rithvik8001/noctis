import dotenv from "dotenv";
dotenv.config();
import connectDb from "./src/db/config/connection";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import authRoute from "./src/routes/auth/route";
import profileRoute from "./src/routes/profile/route";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile", profileRoute);

const PORT = process.env.PORT;
const server = async () => {
  try {
    await connectDb().then(() => {
      console.log("Database connection successful.");
      app.listen(PORT, () => {
        console.log(`Server is running on PORT: ${PORT}`);
      });
    });
  } catch (error) {
    console.log(`Server Error: `, error);
    process.exit(1);
  }
};

server();
