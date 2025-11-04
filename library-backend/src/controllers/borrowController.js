import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

export const borrowController = {
  async borrowBookByUser(req, res) {
    try {
      const { memberId, bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });
      if (book.status !== "available")
        return res.status(400).json({ message: "Book is not available to borrow" });

      const borrow = await Borrow.create({
        borrower: memberId,
        book: bookId,
        borrowDate: new Date(),
        status: "borrowed",
      });

      book.status = "Not available";
      book.currentHolderId = memberId;
      await book.save();

      res.status(201).json({ message: "Book borrowed", borrow });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async returnBookByUser(req, res) {
    try {
      const { memberId, bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      const borrow = await Borrow.findOne({
        borrower: memberId,
        book: bookId,
        status: "borrowed",
      }).sort({ createdAt: -1 });

      if (!borrow) return res.status(400).json({ message: "No active borrow found for this user and book" });

      borrow.status = "returned";
      borrow.returnDate = new Date();
      await borrow.save();

      book.status = "available";
      book.currentHolderId = null;
      await book.save();

      res.json({ message: "Book returned", borrow });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
