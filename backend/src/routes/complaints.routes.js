import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  createComplaint,
  listMyComplaints,
  listForMyRestaurant,
  updateComplaintStatus,
} from "../controllers/complaints.controller.js";

const router = Router();

router.use(authenticate);
router.post("/", requireRole("customer"), createComplaint);
router.get("/mine", requireRole("customer"), listMyComplaints);
router.get("/restaurant", requireRole("admin"), listForMyRestaurant);
router.patch("/:id/status", requireRole("admin"), updateComplaintStatus);

export default router;
