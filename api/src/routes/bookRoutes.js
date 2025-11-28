import { Router } from "express";
import { booksController } from "../controllers/booksController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, booksController.addBook);


router.get("/", authMiddleware, booksController.getAllBooks);

router.get("/search", authMiddleware, booksController.searchBooks);
router.get("/:bookId", authMiddleware, booksController.getBookById);
router.put("/:bookId", authMiddleware, booksController.updateBook);
router.delete("/:bookId", authMiddleware, booksController.deleteBook);
router.get("/:bookId/borrows", authMiddleware, booksController.getIssueHistory);

export default router;
