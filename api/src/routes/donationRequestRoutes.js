import { Router } from "express";
import { donationRequestController } from "../controllers/donationRequestController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, donationRequestController.getAllDonationRequests);

router.patch("/:status/:id", authMiddleware, adminMiddleware, donationRequestController.updateDonationRequest);

export default router;
