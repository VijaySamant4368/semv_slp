import BorrowRequest from "../models/BorrowRequest.js";
import Book from "../models/Book.js";
import Borrow from "../models/Borrow.js";


export const requestBorrow = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status === "borrowed") {
      return res.status(400).json({ message: "Book is already borrowed" });
    }

    const existing = await BorrowRequest.findOne({ userId, bookId, status: "pending" });
    if (existing) return res.status(400).json({ message: "Already requested this book" });

    const request = new BorrowRequest({ userId, bookId });
    await request.save();

    res.json({ message: "Borrow request submitted successfully" });
  } catch (err) {
    console.error("Error requesting borrow:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const checkBorrowRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const existing = await BorrowRequest.findOne({
      userId,
      bookId,
      status: "pending",
    });

    res.json({ requested: !!existing });
  } catch (err) {
    console.error("Error checking request:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateBorrowStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await BorrowRequest.findById(requestId).populate("bookId");
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (!request.bookId) return res.status(404).json({ message: "Book not found" });

    if (status === "approved") {
      if (request.bookId.status === "borrowed") {
        return res.status(400).json({ message: "Book is already borrowed" });
      }

      request.status = "approved";
      request.approvalDate = new Date();

      request.bookId.status = "borrowed";
      request.bookId.currentHolderId = request.userId;
      await request.bookId.save();

      await Borrow.create({
        borrower: request.userId,
        book: request.bookId._id,
        borrowDate: new Date(),
        status: "borrowed",
      });

      await BorrowRequest.updateMany(
        { bookId: request.bookId._id, status: "pending", _id: { $ne: request._id } },
        { status: "rejected" }
      );
    } else if (status === "rejected") {
      request.status = "rejected";
    }

    await request.save();
    res.json({ message: `Request ${status} successfully` });

  } catch (err) {
    console.error("Error updating borrow status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAllBorrowRequests = async (req, res) => {
  try {
    const requests = await BorrowRequest.find()
      .populate("userId", "name email phone")
      .populate("bookId", "title author status");
    res.json(requests);
  } catch (err) {
    console.error("Error fetching borrow requests:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBorrowedBooks = async (req, res) => {
  try {
    const borrowed = await Borrow.find({ status: "borrowed" })
      .populate("book", "title author status")
      .populate("borrower", "name phone email");
    res.json(borrowed);
    
  } catch (err) {
    console.error("Error fetching borrowed books:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const returnBorrowedBook = async (req, res) => {
  try {
    const { borrowId } = req.params;

    const borrow = await Borrow.findById(borrowId).populate("book");
    if (!borrow) return res.status(404).json({ message: "Borrow record not found" });

    borrow.status = "returned";
    borrow.returnDate = new Date();
    await borrow.save();

    borrow.book.status = "available";
    borrow.book.currentHolderId = null;
    await borrow.book.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error("Error returning book:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
