// volunteerRoutes.js
import express from "express";
import { applyVolunteer, getAllVolunteers } from "../controllers/volunteerController.js";
import { adminMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/", applyVolunteer);
router.get("/", adminMiddleware, getAllVolunteers);
export default router;
