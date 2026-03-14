import dotenv from "dotenv";
dotenv.config();
import connectDb from "./src/db/config/connection.js";
import express, { type Express } from "express";

const app: Express = express();

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
