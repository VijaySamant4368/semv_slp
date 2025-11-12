import { Router } from "express";
import { donateController } from "../controllers/donateController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// router.post("/:memberId/:bookId", authMiddleware, donateController.donateBook);
router.get("/", authMiddleware, donateController.getAllDonations);

export default router;
