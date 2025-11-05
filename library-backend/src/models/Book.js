import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  { coverImage: { type: String },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genres: [{ type: String, trim: true }],
    status: { type: String, enum: ["available", "Not available"], default: "available" },
    description: { type: String, trim: true },
    doner: { type: String, required: true },
    currentHolderId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
