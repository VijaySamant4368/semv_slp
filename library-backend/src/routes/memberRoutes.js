import { Router } from "express";
import { memberController } from "../controllers/memberController.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);

router.get("/", auth, memberController.getAllUsers);
router.get("/:memberId", auth, memberController.getUserById);
router.put("/:memberId", auth, memberController.update);
router.delete("/:memberId", auth, memberController.remove);
router.get("/:memberId/borrows", auth, memberController.getIssuingHistory);
router.get("/:memberId/donations", auth, memberController.getDonationHistory);

export default router;
