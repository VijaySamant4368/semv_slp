import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  reason: String,
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Membership", membershipSchema);
