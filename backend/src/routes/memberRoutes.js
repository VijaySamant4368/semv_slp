import { Router } from "express";
import { memberController } from "../controllers/memberController.js";
import { authMiddleware} from "../middleware/auth.js";

const router = Router();

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);

router.post("/verify-otp", memberController.verifyOtp);

router.get("/", authMiddleware, memberController.getAllUsers);
router.get("/:memberId", authMiddleware, memberController.getUserById);
router.put("/:memberId", authMiddleware, memberController.update);
router.delete("/:memberId", authMiddleware, memberController.remove);
router.get("/:memberId/borrows", authMiddleware, memberController.getIssuingHistory);
router.get("/:memberId/donations", authMiddleware, memberController.getDonationHistory);

export default router;
