import mongoose from "mongoose";

const borrowRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  requestDate: { type: Date, default: Date.now },
  approvalDate: { type: Date },
});

export default mongoose.model("BorrowRequest", borrowRequestSchema);
