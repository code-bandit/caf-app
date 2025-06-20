import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";
import { toSnakeCase } from "../utils/caseConvert.js";

async function findOwnRestaurantId(adminId) {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId }, select: { id: true } });
  if (!restaurant) {
    throw new HttpError(404, "You do not have a restaurant set up yet");
  }
  return restaurant.id;
}

export const listByRestaurant = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const items = await prisma.menuItem.findMany({
    where: { restaurantId: Number(req.params.restaurantId), ...(category ? { category } : {}) },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items: toSnakeCase(items) });
});

export const getItem = asyncHandler(async (req, res) => {
  const item = await prisma.menuItem.findUnique({ where: { id: Number(req.params.id) } });
  if (!item) {
    throw new HttpError(404, "Item not found");
  }
  res.json({ item: toSnakeCase(item) });
});

export const listMine = asyncHandler(async (req, res) => {
  const restaurantId = await findOwnRestaurantId(req.user.id);
  const items = await prisma.menuItem.findMany({
    where: { restaurantId },
    orderBy: { createdAt: "desc" },
  });
  res.json({ items: toSnakeCase(items) });
});

export const createItem = asyncHandler(async (req, res) => {
  const restaurantId = await findOwnRestaurantId(req.user.id);
  requireFields(req.body, ["name", "price"]);
  const { name, description, price, image_url: imageUrl, category } = req.body;

  const item = await prisma.menuItem.create({
    data: {
      restaurantId,
      category: category || "main_dish",
      name,
      description: description || null,
      price,
      imageUrl: imageUrl || null,
    },
  });
  res.status(201).json({ item: toSnakeCase(item) });
});

async function assertOwnsItem(adminId, itemId) {
  const item = await prisma.menuItem.findFirst({
    where: { id: itemId, restaurant: { adminId } },
  });
  if (!item) {
    throw new HttpError(404, "Item not found");
  }
  return item;
}

const BODY_TO_FIELD = {
  name: "name",
  description: "description",
  price: "price",
  image_url: "imageUrl",
  category: "category",
};

export const updateItem = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.id);
  await assertOwnsItem(req.user.id, itemId);

  const data = {};
  for (const [bodyKey, field] of Object.entries(BODY_TO_FIELD)) {
    if (req.body[bodyKey] !== undefined) data[field] = req.body[bodyKey];
  }
  if (!Object.keys(data).length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const item = await prisma.menuItem.update({ where: { id: itemId }, data });
  res.json({ item: toSnakeCase(item) });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const itemId = Number(req.params.id);
  await assertOwnsItem(req.user.id, itemId);
  await prisma.menuItem.delete({ where: { id: itemId } });
  res.status(204).send();
});
