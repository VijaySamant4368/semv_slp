import mongoose from "mongoose";

const donateSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Donate", donateSchema);
