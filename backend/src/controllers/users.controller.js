import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

function toSafeUser(row) {
  const { password_hash, ...safe } = row;
  return safe;
}

export const getMe = asyncHandler(async (req, res) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [req.user.id]);
  if (!result.rowCount) {
    throw new HttpError(404, "User not found");
  }
  res.json({ user: toSafeUser(result.rows[0]) });
});

const EDITABLE_FIELDS = ["name", "phone", "address", "gender", "username"];

export const updateMe = asyncHandler(async (req, res) => {
  const updates = EDITABLE_FIELDS.filter((field) => req.body[field] !== undefined);
  if (!updates.length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const setClause = updates.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const values = updates.map((field) => req.body[field]);

  const result = await query(
    `UPDATE users SET ${setClause} WHERE id = $${updates.length + 1} RETURNING *`,
    [...values, req.user.id]
  );
  res.json({ user: toSafeUser(result.rows[0]) });
});
