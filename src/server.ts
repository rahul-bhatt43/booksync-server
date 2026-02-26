import http from "http";
import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Connect to MongoDB
connectDB();

if (!process.env.VERCEL) {
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
