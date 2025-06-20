import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";
import { toSnakeCase } from "../utils/caseConvert.js";

export const createHistoryEntry = asyncHandler(async (req, res) => {
  requireFields(req.body, ["restaurantId", "menuItemId"]);
  const { restaurantId, menuItemId, quantity = 1 } = req.body;

  const menuItem = await prisma.menuItem.findFirst({
    where: { id: Number(menuItemId), restaurantId: Number(restaurantId) },
  });
  if (!menuItem) {
    throw new HttpError(404, "Menu item not found for this restaurant");
  }

  const entry = await prisma.history.create({
    data: {
      customerId: req.user.id,
      restaurantId: Number(restaurantId),
      menuItemId: Number(menuItemId),
      quantity,
    },
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(restaurantId) },
    select: { adminId: true },
  });
  if (restaurant) {
    await prisma.notification.create({
      data: {
        userId: restaurant.adminId,
        title: "New order",
        message: `A customer ordered ${menuItem.name} (x${quantity}).`,
      },
    });
  }

  res.status(201).json({ entry: toSnakeCase(entry) });
});

export const listMyHistory = asyncHandler(async (req, res) => {
  const entries = await prisma.history.findMany({
    where: { customerId: req.user.id },
    include: {
      restaurant: { select: { name: true } },
      menuItem: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    history: entries.map(({ restaurant, menuItem, ...entry }) => ({
      ...toSnakeCase(entry),
      restaurant_name: restaurant.name,
      item_name: menuItem.name,
      price: menuItem.price,
    })),
  });
});

export const listForMyRestaurant = asyncHandler(async (req, res) => {
  const entries = await prisma.history.findMany({
    where: { restaurant: { adminId: req.user.id } },
    include: {
      customer: { select: { name: true } },
      menuItem: { select: { name: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    history: entries.map(({ customer, menuItem, ...entry }) => ({
      ...toSnakeCase(entry),
      customer_name: customer.name,
      item_name: menuItem.name,
      price: menuItem.price,
    })),
  });
});
