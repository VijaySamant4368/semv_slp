import Donate from "../models/Donate.js";
import Book from "../models/Book.js";

export const donateController = {
  // async donateBook(req, res) {
  //   try {
  //     const { memberId } = req.params;
  //     const { bookId } = req.params;

  //     const book = await Book.findById(bookId);
  //     if (!book) return res.status(404).json({ message: "Book not found" });

  //     book.donor = memberId;
  //     await book.save();

  //     const donation = await Donate.create({ donor: memberId, book: bookId });

  //     res.status(201).json({ message: "Donation recorded", donation });
  //   } catch (e) {
  //     res.status(500).json({ message: e.message });
  //   }
  // },

  async getAllDonations(req, res) {
    try {
      const donations = await Donate.find()
        .populate("donor", "name email")
        .populate("book", "title author")
        .sort({ createdAt: -1 });
      res.json(donations);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
