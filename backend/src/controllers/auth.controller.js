import bcrypt from "bcryptjs";
import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields, isValidEmail } from "../utils/validators.js";
import { toSnakeCase } from "../utils/caseConvert.js";
import {
  signAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "../services/token.service.js";
import { generateOtp, hashOtp, compareOtp, deliverOtp } from "../services/otp.service.js";

function toSafeUser(user) {
  const { passwordHash, ...safe } = user;
  return toSnakeCase(safe);
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

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) {
    throw new HttpError(409, "An account with that email or username already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      role,
      name,
      email,
      phone: phone || null,
      username,
      gender: gender || null,
      address: address || null,
      passwordHash,
      ...(role === "admin" ? { restaurant: { create: { name: businessName } } } : {}),
    },
  });

  res.status(201).json({ user: toSafeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { role = "customer", identifier, password } = req.body;
  requireFields(req.body, ["identifier", "password"]);

  const user = await prisma.user.findFirst({
    where: { role, OR: [{ email: identifier }, { username: identifier }] },
  });
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials");
  }

  const { code, expiresAt } = generateOtp();
  const codeHash = await hashOtp(code);
  await prisma.twoFactorCode.create({
    data: { userId: user.id, codeHash, expiresAt },
  });
  deliverOtp(user, code);

  res.json({ requiresTwoFactor: true, userId: user.id });
});

export const verifyTwoFactor = asyncHandler(async (req, res) => {
  const { userId, code } = req.body;
  requireFields(req.body, ["userId", "code"]);

  const record = await prisma.twoFactorCode.findFirst({
    where: { userId: Number(userId), consumed: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) {
    throw new HttpError(401, "Verification code has expired, please sign in again");
  }

  const valid = await compareOtp(code, record.codeHash);
  if (!valid) {
    throw new HttpError(401, "Incorrect verification code");
  }

  await prisma.twoFactorCode.update({ where: { id: record.id }, data: { consumed: true } });

  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

  const accessToken = signAccessToken(user);
  const { raw, hash, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: hash, expiresAt },
  });

  res.cookie(REFRESH_COOKIE_NAME, raw, refreshCookieOptions());
  res.json({ accessToken, user: toSafeUser(user) });
});

export const refresh = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!raw) {
    throw new HttpError(401, "Missing refresh token");
  }

  const hash = hashToken(raw);
  const record = await prisma.refreshToken.findFirst({
    where: { tokenHash: hash, revoked: false, expiresAt: { gt: new Date() } },
  });
  if (!record) {
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
    throw new HttpError(401, "Refresh token is invalid or expired");
  }

  await prisma.refreshToken.update({ where: { id: record.id }, data: { revoked: true } });

  const user = await prisma.user.findUnique({ where: { id: record.userId } });

  const accessToken = signAccessToken(user);
  const next = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: next.hash, expiresAt: next.expiresAt },
  });

  res.cookie(REFRESH_COOKIE_NAME, next.raw, refreshCookieOptions());
  res.json({ accessToken, user: toSafeUser(user) });
});

export const logout = asyncHandler(async (req, res) => {
  const raw = req.cookies?.[REFRESH_COOKIE_NAME];
  if (raw) {
    const hash = hashToken(raw);
    await prisma.refreshToken.updateMany({ where: { tokenHash: hash }, data: { revoked: true } });
  }
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions());
  res.status(204).send();
});
