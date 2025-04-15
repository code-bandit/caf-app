import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";

export const createHistoryEntry = asyncHandler(async (req, res) => {
  requireFields(req.body, ["restaurantId", "menuItemId"]);
  const { restaurantId, menuItemId, quantity = 1 } = req.body;

  const itemResult = await query(
    "SELECT * FROM menu_items WHERE id = $1 AND restaurant_id = $2",
    [menuItemId, restaurantId]
  );
  if (!itemResult.rowCount) {
    throw new HttpError(404, "Menu item not found for this restaurant");
  }

  const result = await query(
    `INSERT INTO history (customer_id, restaurant_id, menu_item_id, quantity)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [req.user.id, restaurantId, menuItemId, quantity]
  );

  const restaurant = await query("SELECT admin_id, name FROM restaurants WHERE id = $1", [restaurantId]);
  if (restaurant.rowCount) {
    await query(
      `INSERT INTO notifications (user_id, title, message)
       VALUES ($1, $2, $3)`,
      [
        restaurant.rows[0].admin_id,
        "New order",
        `A customer ordered ${itemResult.rows[0].name} (x${quantity}).`,
      ]
    );
  }

  res.status(201).json({ entry: result.rows[0] });
});

export const listMyHistory = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT h.*, r.name AS restaurant_name, mi.name AS item_name, mi.price
     FROM history h
     JOIN restaurants r ON r.id = h.restaurant_id
     JOIN menu_items mi ON mi.id = h.menu_item_id
     WHERE h.customer_id = $1 ORDER BY h.created_at DESC`,
    [req.user.id]
  );
  res.json({ history: result.rows });
});

export const listForMyRestaurant = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT h.*, u.name AS customer_name, mi.name AS item_name, mi.price
     FROM history h
     JOIN restaurants r ON r.id = h.restaurant_id
     JOIN users u ON u.id = h.customer_id
     JOIN menu_items mi ON mi.id = h.menu_item_id
     WHERE r.admin_id = $1 ORDER BY h.created_at DESC`,
    [req.user.id]
  );
  res.json({ history: result.rows });
});
