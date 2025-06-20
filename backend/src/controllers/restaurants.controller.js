import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { toSnakeCase, formatTime } from "../utils/caseConvert.js";

function serializeRestaurant(restaurant) {
  return {
    ...toSnakeCase(restaurant),
    opens_at: formatTime(restaurant.opensAt),
    closes_at: formatTime(restaurant.closesAt),
  };
}

const PUBLIC_SELECT = {
  id: true,
  name: true,
  imageUrl: true,
  opensAt: true,
  closesAt: true,
  status: true,
  queueStatus: true,
  createdAt: true,
};

export const listRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await prisma.restaurant.findMany({
    select: PUBLIC_SELECT,
    orderBy: { name: "asc" },
  });
  res.json({ restaurants: restaurants.map(serializeRestaurant) });
});

export const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: Number(req.params.id) },
    select: PUBLIC_SELECT,
  });
  if (!restaurant) {
    throw new HttpError(404, "Restaurant not found");
  }
  res.json({ restaurant: serializeRestaurant(restaurant) });
});

async function findOwnRestaurant(adminId) {
  const restaurant = await prisma.restaurant.findUnique({ where: { adminId } });
  if (!restaurant) {
    throw new HttpError(404, "You do not have a restaurant set up yet");
  }
  return restaurant;
}

export const getMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await findOwnRestaurant(req.user.id);
  res.json({ restaurant: serializeRestaurant(restaurant) });
});

const BODY_TO_FIELD = {
  name: "name",
  image_url: "imageUrl",
  opens_at: "opensAt",
  closes_at: "closesAt",
  status: "status",
  queue_status: "queueStatus",
};

export const updateMyRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await findOwnRestaurant(req.user.id);

  const data = {};
  for (const [bodyKey, field] of Object.entries(BODY_TO_FIELD)) {
    if (req.body[bodyKey] !== undefined) data[field] = req.body[bodyKey];
  }
  if (!Object.keys(data).length) {
    throw new HttpError(400, "No editable fields provided");
  }

  const updated = await prisma.restaurant.update({ where: { id: restaurant.id }, data });
  res.json({ restaurant: serializeRestaurant(updated) });
});
