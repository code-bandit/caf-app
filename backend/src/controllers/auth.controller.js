import bcrypt from "bcryptjs";
import { query } from "../db/pool.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields, isValidEmail } from "../utils/validators.js";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "../services/token.service.js";
import { generateOtp, hashOtp, compareOtp, deliverOtp } from "../services/otp.service.js";

function toSafeUser(row) {
  const { password_hash, ...safe } = row;
  return safe;
}

export const signup = asyncHandler(async (req, res) => {
  const { role = "customer", name, email, phone, username, password, gender, address, businessName } = req.body;

  if (!["customer", "admin"].includes(role)) {
    throw new HttpError(400, "Role must be either 'customer' or 'admin'");
  }
  requireFields(req.body, ["name", "email", "username", "password"]);
  if (!isValidEmail(email)) {
    throw new HttpError(400, "A valid email is required");
  }
  if (role === "admin") {
    requireFields(req.body, ["businessName"]);
  }

  const existing = await query("SELECT id FROM users WHERE email = $1 OR username = $2", [email, username]);
  if (existing.rowCount > 0) {
    throw new HttpError(409, "An account with that email or username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const inserted = await query(
    `INSERT INTO users (role, name, email, phone, username, gender, address, password_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [role, name, email, phone || null, username, gender || null, address || null, passwordHash]
  );
  const user = inserted.rows[0];

  if (role === "admin") {
    await query(
      `INSERT INTO restaurants (admin_id, name) VALUES ($1, $2)`,
      [user.id, businessName]
    );
  }

  res.status(201).json({ user: toSafeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { role = "customer", identifier, password } = req.body;
  requireFields(req.body, ["identifier", "password"]);

  const result = await query(
    "SELECT * FROM users WHERE role = $1 AND (email = $2 OR username = $2)",
    [role, identifier]
  );
  const user = result.rows[0];
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials");
  }

  const { code, expiresAt } = generateOtp();
  const codeHash = await hashOtp(code);
  await query(
    `INSERT INTO two_factor_codes (user_id, code_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, codeHash, expiresAt]
  );
  deliverOtp(user, code);

  res.json({ requiresTwoFactor: true, userId: user.id });
});

export const verifyTwoFactor = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  requireFields(req.body, ["userId", "code"]);

  const result = await query(
    `SELECT * FROM two_factor_codes
     WHERE user_id = $1 AND consumed = false AND expires_at > now()
     ORDER BY created_at DESC LIMIT 1`,
    [userId]
  );
  const record = result.rows[0];
  if (!record) {
    throw new HttpError(401, "Verification code has expired, please sign in again");
  }

  const valid = await compareOtp(code, record.code_hash);
  if (!valid) {
    throw new HttpError(401, "Incorrect verification code");
  }

  await query("UPDATE two_factor_codes SET consumed = true WHERE id = $1", [record.id]);

  const userResult = await query("SELECT * FROM users WHERE id = $1", [userId]);
  const user = userResult.rows[0];

  const accessToken = signAccessToken(user);
  const { raw, hash, expiresAt } = generateRefreshToken();
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, hash, expiresAt]
  );

  res.cookie(REFRESH_COOKIE_NAME, raw, refreshCookieOptions());
  res.json({ accessToken, user: toSafeUser(user) });
});

export const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!raw) {
    throw new HttpError(401, "Missing refresh token");
  }

  const hash = hashToken(raw);
  const result = await query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked = false AND expires_at > now()`,
    [hash]
  );
  const record = result.rows[0];
  if (!record) {
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
    throw new HttpError(401, "Refresh token is invalid or expired");
  }

  await query("UPDATE refresh_tokens SET revoked = true WHERE id = $1", [record.id]);

  const userResult = await query("SELECT * FROM users WHERE id = $1", [record.user_id]);
  const user = userResult.rows[0];

  const accessToken = signAccessToken(user);
  const next = generateRefreshToken();
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, next.hash, next.expiresAt]
  );

  res.cookie(REFRESH_COOKIE_NAME, next.raw, refreshCookieOptions());
  res.json({ accessToken, user: toSafeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (raw) {
    const hash = hashToken(raw);
    await query("UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1", [hash]);
  }
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
  res.status(204).send();
});
