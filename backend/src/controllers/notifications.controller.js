import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const listMine = asyncHandler(async (req, res) => {
  const result = await query(
    "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
    [req.user.id]
  );
  res.json({ notifications: result.rows });
});

export const markRead = asyncHandler(async (req, res) => {
  const result = await query(
    "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *",
    [req.params.id, req.user.id]
  );
  if (!result.rowCount) {
    throw new HttpError(404, "Notification not found");
  }
  res.json({ notification: result.rows[0] });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await query("UPDATE notifications SET is_read = true WHERE user_id = $1", [req.user.id]);
  res.status(204).send();
});
