import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
    status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
  },
  { timestamps: true }
);

export default mongoose.model("Borrow", borrowSchema);
