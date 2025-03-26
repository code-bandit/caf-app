import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getMe, updateMe } from "../controllers/users.controller.js";

const router = Router();

router.use(authenticate);
router.get("/me", getMe);
router.patch("/me", updateMe);

export default router;
