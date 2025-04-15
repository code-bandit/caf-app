import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import { createHistoryEntry, listMyHistory, listForMyRestaurant } from "../controllers/history.controller.js";

const router = Router();

router.use(authenticate);
router.post("/", requireRole("customer"), createHistoryEntry);
router.get("/mine", requireRole("customer"), listMyHistory);
router.get("/restaurant", requireRole("admin"), listForMyRestaurant);

export default router;
