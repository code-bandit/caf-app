import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";

export const createComplaint = asyncHandler(async (req, res) => {
  requireFields(req.body, ["restaurantId", "message"]);
  const { restaurantId, message } = req.body;

  const result = await query(
    `INSERT INTO complaints (customer_id, restaurant_id, message)
     VALUES ($1, $2, $3) RETURNING *`,
    [req.user.id, restaurantId, message]
  );
  res.status(201).json({ complaint: result.rows[0] });
});

export const listMyComplaints = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT c.*, r.name AS restaurant_name FROM complaints c
     JOIN restaurants r ON r.id = c.restaurant_id
     WHERE c.customer_id = $1 ORDER BY c.created_at DESC`,
    [req.user.id]
  );
  res.json({ complaints: result.rows });
});

export const listForMyRestaurant = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT c.*, u.name AS customer_name FROM complaints c
     JOIN restaurants r ON r.id = c.restaurant_id
     JOIN users u ON u.id = c.customer_id
     WHERE r.admin_id = $1 ORDER BY c.created_at DESC`,
    [req.user.id]
  );
  res.json({ complaints: result.rows });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["open", "resolved"].includes(status)) {
    throw new HttpError(400, "Status must be 'open' or 'resolved'");
  }

  const result = await query(
    `UPDATE complaints c SET status = $1
     FROM restaurants r
     WHERE c.id = $2 AND c.restaurant_id = r.id AND r.admin_id = $3
     RETURNING c.*`,
    [status, req.params.id, req.user.id]
  );
  if (!result.rowCount) {
    throw new HttpError(404, "Complaint not found");
  }
  res.json({ complaint: result.rows[0] });
});
