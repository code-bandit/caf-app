import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { toSnakeCase } from "../utils/caseConvert.js";

function toSafeUser(user) {
  const { passwordHash, ...safe } = user;
  return toSnakeCase(safe);
}

export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  res.json({ user: toSafeUser(user) });
});

const EDITABLE_FIELDS = ["name", "phone", "address", "gender", "username"];

export const updateMe = asyncHandler(async (req, res) => {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }
  if (!Object.keys(data).length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const user = await prisma.user.update({ where: { id: req.user.id }, data });
  res.json({ user: toSafeUser(user) });
});
