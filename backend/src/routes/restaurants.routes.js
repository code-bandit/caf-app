import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  listRestaurants,
  getRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
} from "../controllers/restaurants.controller.js";

const router = Router();

router.get("/", listRestaurants);
router.get("/mine", authenticate, requireRole("admin"), getMyRestaurant);
router.patch("/mine", authenticate, requireRole("admin"), updateMyRestaurant);
router.get("/:id", getRestaurant);

export default router;
