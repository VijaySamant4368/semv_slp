import express from "express";
import {
  requestBorrow,
  updateBorrowStatus,
  getAllBorrowRequests,
  getBorrowedBooks,
  returnBorrowedBook,
  checkBorrowRequest,
} from "../controllers/borrowController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/request/:bookId", authMiddleware, requestBorrow);
router.get("/check/:bookId", authMiddleware, checkBorrowRequest);

router.get("/", authMiddleware, adminMiddleware, getAllBorrowRequests);
router.get("/borrowed", authMiddleware, adminMiddleware, getBorrowedBooks); // new route
router.patch("/update/:requestId", authMiddleware, adminMiddleware, updateBorrowStatus);
router.patch("/return/:borrowId", authMiddleware, adminMiddleware, returnBorrowedBook); // new route

export default router;
