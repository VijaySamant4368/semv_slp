import { Router } from "express";
import { donateController } from "../controllers/donateController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/:memberId/:bookId", auth, donateController.donateBook);
router.get("/", auth, donateController.getAllDonations);

export default router;
