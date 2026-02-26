import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.db.uri as string, {
      dbName: config.db.name,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error: any) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
