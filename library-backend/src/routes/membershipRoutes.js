// membershipRoutes.js
import express from "express";
import { applyMembership, getAllMemberships } from "../controllers/membershipController.js";
import { adminMiddleware } from "../middleware/auth.js";
const router = express.Router();

router.post("/", applyMembership);
router.get("/", adminMiddleware, getAllMemberships);
export default router;
