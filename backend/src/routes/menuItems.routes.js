import { Router } from "express";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  listByRestaurant,
  getItem,
  listMine,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/menuItems.controller.js";

const router = Router();

router.get("/mine", authenticate, requireRole("admin"), listMine);
router.post("/", authenticate, requireRole("admin"), createItem);
router.patch("/:id", authenticate, requireRole("admin"), updateItem);
router.delete("/:id", authenticate, requireRole("admin"), deleteItem);
router.get("/restaurant/:restaurantId", listByRestaurant);
router.get("/:id", getItem);

export default router;
