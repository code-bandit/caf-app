import { Router } from "express";
import { signup, login, verifyTwoFactor, refresh, logout } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-2fa", verifyTwoFactor);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
