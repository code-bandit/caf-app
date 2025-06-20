import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { toSnakeCase } from "../utils/caseConvert.js";

export const listMine = asyncHandler(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json({ notifications: toSnakeCase(notifications) });
});

export const markRead = asyncHandler(async (req, res) => {
  const notificationId = Number(req.params.id);
  const { count } = await prisma.notification.updateMany({
    where: { id: notificationId, userId: req.user.id },
    data: { isRead: true },
  });
  if (!count) {
    throw new HttpError(404, "Notification not found");
  }

  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  res.json({ notification: toSnakeCase(notification) });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await prisma.notification.updateMany({ where: { userId: req.user.id }, data: { isRead: true } });
  res.status(204).send();
});
