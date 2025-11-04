import { Router } from "express";
import { borrowController } from "../controllers/borrowController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/borrow/:memberId/:bookId", auth, borrowController.borrowBookByUser);
router.post("/return/:memberId/:bookId", auth, borrowController.returnBookByUser);

export default router;
