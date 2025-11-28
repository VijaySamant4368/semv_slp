import { Router } from "express";
import { donateController } from "../controllers/donateController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, donateController.getAllDonations);

export default router;
