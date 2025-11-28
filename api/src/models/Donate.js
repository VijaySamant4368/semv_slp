import mongoose from "mongoose";

const donateSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" }, // assigned when approved
    bookData: {
      title: String,
      author: String,
      genres: [String],
      description: String,
      coverImage: String,
    },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Donate", donateSchema);
