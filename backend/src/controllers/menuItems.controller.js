import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";

async function findOwnRestaurantId(adminId) {
  const result = await query("SELECT id FROM restaurants WHERE admin_id = $1", [adminId]);
  if (!result.rowCount) {
    throw new HttpError(404, "You do not have a restaurant set up yet");
  }
  return result.rows[0].id;
}

export const listByRestaurant = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const params = [req.params.restaurantId];
  let sql = "SELECT * FROM menu_items WHERE restaurant_id = $1";
  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  sql += " ORDER BY created_at DESC";

  const result = await query(sql, params);
  res.json({ items: result.rows });
});

export const getItem = asyncHandler(async (req, res) => {
  const result = await query("SELECT * FROM menu_items WHERE id = $1", [req.params.id]);
  if (!result.rowCount) {
    throw new HttpError(404, "Item not found");
  }
  res.json({ item: result.rows[0] });
});

export const listMine = asyncHandler(async (req, res) => {
  const restaurantId = await findOwnRestaurantId(req.user.id);
  const result = await query(
    "SELECT * FROM menu_items WHERE restaurant_id = $1 ORDER BY created_at DESC",
    [restaurantId]
  );
  res.json({ items: result.rows });
});

export const createItem = asyncHandler(async (req, res) => {
  const restaurantId = await findOwnRestaurantId(req.user.id);
  requireFields(req.body, ["name", "price"]);
  const { name, description, price, image_url, category } = req.body;

  const result = await query(
    `INSERT INTO menu_items (restaurant_id, category, name, description, price, image_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [restaurantId, category || "main_dish", name, description || null, price, image_url || null]
  );
  res.status(201).json({ item: result.rows[0] });
});

async function assertOwnsItem(adminId, itemId) {
  const result = await query(
    `SELECT mi.* FROM menu_items mi
     JOIN restaurants r ON r.id = mi.restaurant_id
     WHERE mi.id = $1 AND r.admin_id = $2`,
    [itemId, adminId]
  );
  if (!result.rowCount) {
    throw new HttpError(404, "Item not found");
  }
  return result.rows[0];
}

const EDITABLE_FIELDS = ["name", "description", "price", "image_url", "category"];

export const updateItem = asyncHandler(async (req, res) => {
  await assertOwnsItem(req.user.id, req.params.id);
  const updates = EDITABLE_FIELDS.filter((field) => req.body[field] !== undefined);
  if (!updates.length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const setClause = updates.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const values = updates.map((field) => req.body[field]);

  const result = await query(
    `UPDATE menu_items SET ${setClause} WHERE id = $${updates.length + 1} RETURNING *`,
    [...values, req.params.id]
  );
  res.json({ item: result.rows[0] });
});

export const deleteItem = asyncHandler(async (req, res) => {
  await assertOwnsItem(req.user.id, req.params.id);
  await query("DELETE FROM menu_items WHERE id = $1", [req.params.id]);
  res.status(204).send();
});
