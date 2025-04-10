import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { listMine, markRead, markAllRead } from "../controllers/notifications.controller.js";

const router = Router();

router.use(authenticate);
router.get("/", listMine);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

export default router;
