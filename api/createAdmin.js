import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Member from "./src/models/Member.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("admin123", 10);

await Member.updateOne(
  { email: "admin@example.com" },
  { $set: { password: hashedPassword, role: "admin" } },
  { upsert: true }
);

console.log("Admin password reset successfully");
process.exit();
