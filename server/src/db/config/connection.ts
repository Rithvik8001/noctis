import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({ client });

const connectDb = async () => {
  try {
    await client.execute("SELECT 1");
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDb;
