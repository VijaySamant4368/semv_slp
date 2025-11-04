import { Router } from "express";
import { booksController } from "../controllers/booksController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth, booksController.getAllBooks);
router.post("/", auth, booksController.addBook);
router.get("/:bookId", auth, booksController.getBookById);
router.put("/:bookId", auth, booksController.updateBook);
router.delete("/:bookId", auth, booksController.deleteBook);
router.get("/:bookId/borrows", auth, booksController.getIssueHistory);

export default router;
