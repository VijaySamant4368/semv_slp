import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";
import Donate from "../models/Donate.js";
import Member from "../models/Member.js";

export const booksController = {
   async addBook(req, res) {
    try {
      const { title, author, genres, description, coverImage } = req.body;

      if (!title || !author)
        return res.status(400).json({ message: "Title and author are required" });

      // ✅ Logged-in user from JWT
      const donorId = req.user?.id;
      if (!donorId)
        return res.status(401).json({ message: "Unauthorized: Donor not found" });

      const donor = await Member.findById(donorId);
      if (!donor)
        return res.status(404).json({ message: "Member not found" });

      // ✅ Create book using image URL instead of file path
      const book = await Book.create({
        coverImage: coverImage || null, // <—— Cloudinary image URL from frontend
        title,
        author,
        genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
        description,
        donor: donor.name,
        status: "available",
      });

      // ✅ Record in donation history
      await Donate.create({
        donor: donorId,
        book: book._id,
      });

      res.status(201).json({
        message: `Book "${book.title}" donated successfully by ${donor.name}`,
        book,
      });
    } catch (e) {
      console.error("Error donating book:", e);
      res.status(500).json({ message: "Failed to donate book", error: e.message });
    }
  },

  async getAllBooks(req, res) {
    try {
      const { search, author, status, genre } = req.query;
      const filter = {};
      if (search) filter.title = { $regex: search, $options: "i" };
      if (author) filter.author = { $regex: author, $options: "i" };
      if (status) filter.status = status;
      if (genre) filter.genres = { $in: [genre] };

      const books = await Book.find(filter).sort({ createdAt: -1 });
      res.json(books);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getBookById(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async updateBook(req, res) {
    try {
      const { bookId } = req.params;
      const { title, author, genres, status, description } = req.body;

      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (title !== undefined) book.title = title;
      if (author !== undefined) book.author = author;
      if (description !== undefined) book.description = description;
      if (status !== undefined) book.status = status;
      if (genres !== undefined)
        book.genres = Array.isArray(genres) ? genres : genres ? [genres] : [];

      await book.save();
      res.json(book);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const { bookId } = req.params;
      const deleted = await Book.findByIdAndDelete(bookId);
      if (!deleted) return res.status(404).json({ message: "Book not found" });
      res.json({ message: "Book deleted" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getIssueHistory(req, res) {
    try {
      const { bookId } = req.params;
      const history = await Borrow.find({ book: bookId })
        .populate("borrower", "name email")
        .sort({ createdAt: -1 });
      res.json(history);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
