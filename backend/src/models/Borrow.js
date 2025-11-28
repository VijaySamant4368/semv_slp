import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date},
    status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
    reminderSent: { type: Boolean, default: false }
  },
  { timestamps: true }
);

borrowSchema.pre("save", function (next) {
  if (!this.returnDate) {
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    this.returnDate = new Date(this.borrowDate.getTime() + twoWeeks);
  }
  next();
});

export default mongoose.model("Borrow", borrowSchema);
