import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const listRestaurants = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, image_url, opens_at, closes_at, status, queue_status, created_at
     FROM restaurants ORDER BY name ASC`
  );
  res.json({ restaurants: result.rows });
});

export const getRestaurant = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT id, name, image_url, opens_at, closes_at, status, queue_status, created_at
     FROM restaurants WHERE id = $1`,
    [req.params.id]
  );
  if (!result.rowCount) {
    throw new HttpError(404, "Restaurant not found");
  }
  res.json({ restaurant: result.rows[0] });
});

async function findOwnRestaurant(adminId) {
  const result = await query("SELECT * FROM restaurants WHERE admin_id = $1", [adminId]);
  if (!result.rowCount) {
    throw new HttpError(404, "You do not have a restaurant set up yet");
  }
  return result.rows[0];
}

export const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await findOwnRestaurant(req.user.id);
  res.json({ restaurant });
});

const EDITABLE_FIELDS = ["name", "image_url", "opens_at", "closes_at", "status", "queue_status"];

export const updateMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await findOwnRestaurant(req.user.id);
  const updates = EDITABLE_FIELDS.filter((field) => req.body[field] !== undefined);
  if (!updates.length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const setClause = updates.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const values = updates.map((field) => req.body[field]);

  const result = await query(
    `UPDATE restaurants SET ${setClause} WHERE id = $${updates.length + 1} RETURNING *`,
    [...values, restaurant.id]
  );
  res.json({ restaurant: result.rows[0] });
});
