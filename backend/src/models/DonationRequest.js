// models/DonationRequest.js
import mongoose from "mongoose";

const donationRequestSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  
  title: { type: String, required: true },
  author: { type: String, required: true },
  genres: [{ type: String }],
  description: { type: String },
  coverImage: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestDate: { type: Date, default: Date.now },
});

export default mongoose.model("DonationRequest", donationRequestSchema);
