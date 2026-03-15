import dotenv from "dotenv";
dotenv.config();
import connectDb from "./src/db/config/connection";
import express, { type Express } from "express";

const app: Express = express();

import authRoute from "./src/routes/auth/route";

app.use("/api/v1/auth", authRoute);

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
