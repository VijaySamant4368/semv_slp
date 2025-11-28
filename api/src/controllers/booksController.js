import Book from "../models/Book.js";
import DonationRequest from "../models/DonationRequest.js";
import Donate from "../models/Donate.js";
import Member from "../models/Member.js";

export const booksController = {
  async addBook(req, res) {
    try {
      const { title, author, genres, description, coverImage } = req.body;
      const donorId = req.user?.id;
      if (!donorId) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
      }
      if (!title || !author)
        return res.status(400).json({ message: "Title and author are required" });

      const donor = await Member.findById(donorId);
      if (!donor) return res.status(404).json({ message: "Member not found" });

      if (donor.role === "member") {
        const existingRequest = await DonationRequest.findOne({ donor: donorId, title, author, status: "pending" });
        if (existingRequest) {
          return res.status(400).json({ message: "Donation request for this book is already pending" });
        }

        const request = new DonationRequest({
          donor: donorId,
          title,
          author,
          genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
          description,
          coverImage,
        });

        await request.save();
        return res.status(201).json({
          message: `Donation request for "${title}" submitted successfully`,
          request,
        });
      }

      const book = await Book.create({
        coverImage: coverImage || null,
        title,
        author,
        genres: Array.isArray(genres) ? genres : genres ? [genres] : [],
        description,
        donor: donor.name,
        status: "available",
      });

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
      res.status(500).json({
        message: "Failed to donate book",
        error: e.message,
      });
    }
  },

  async getAllBooks(req, res) {
    try {
      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 20;
      let skip = (page - 1) * limit;

      const totalBooks = await Book.countDocuments();
      const totalPages = Math.ceil(totalBooks / limit);

      const books = await Book.find()
        .skip(skip)
        .limit(limit);

      res.json({
        books,
        totalPages,
        currentPage: page,
        totalBooks
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getBookById(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async updateBook(req, res) {
    try {
      const { bookId } = req.params;
      const { title, author, genres, description, coverImage } = req.body;

      const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        { title, author, genres, description, coverImage },
        { new: true }
      );

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json({ message: "Book updated successfully", updatedBook });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
  async searchBooks(req, res) {
    try {
      const query = req.query.search || "";

      let page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 20;
      let skip = (page - 1) * limit;

      const searchCondition = {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { genres: { $regex: query, $options: "i" } },
        ],
      };

      const totalBooks = await Book.countDocuments(searchCondition);
      const totalPages = Math.ceil(totalBooks / limit);

      const books = await Book.find(searchCondition)
        .skip(skip)
        .limit(limit);

      res.json({
        books,
        totalPages,
        currentPage: page,
        totalBooks
      });

    } catch (e) {
      console.error("Error searching books:", e);
      res.status(500).json({ message: e.message });
    }
  },


  async deleteBook(req, res) {
    try {
      const { bookId } = req.params;
      const deletedBook = await Book.findByIdAndDelete(bookId);

      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      await Donate.deleteMany({ book: bookId });

      res.json({ message: `Book "${deletedBook.title}" deleted successfully` });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async getIssueHistory(req, res) {
    try {
      const { bookId } = req.params;
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const issues = await Donate.find({ book: bookId }).populate("donor", "name email");

      res.json(issues);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },
};
