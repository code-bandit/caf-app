import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TTL_DAYS = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, ACCESS_SECRET, {
    expiresIn: ACCESS_TTL,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function generateRefreshToken() {
  const raw = crypto.randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
  return { raw, hash: hashToken(raw), expiresAt };
}

export function hashToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export const REFRESH_COOKIE_NAME = "caf_refresh_token";

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  };
}
