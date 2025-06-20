import { prisma } from "../db/prismaClient.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { requireFields } from "../utils/validators.js";
import { toSnakeCase } from "../utils/caseConvert.js";

export const createComplaint = asyncHandler(async (req, res) => {
  requireFields(req.body, ["restaurantId", "message"]);
  const { restaurantId, message } = req.body;

  const complaint = await prisma.complaint.create({
    data: { customerId: req.user.id, restaurantId: Number(restaurantId), message },
  });
  res.status(201).json({ complaint: toSnakeCase(complaint) });
});

export const listMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    where: { customerId: req.user.id },
    include: { restaurant: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    complaints: complaints.map(({ restaurant, ...c }) => ({
      ...toSnakeCase(c),
      restaurant_name: restaurant.name,
    })),
  });
});

export const listForMyRestaurant = asyncHandler(async (req, res) => {
  const complaints = await prisma.complaint.findMany({
    where: { restaurant: { adminId: req.user.id } },
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    complaints: complaints.map(({ customer, ...c }) => ({
      ...toSnakeCase(c),
      customer_name: customer.name,
    })),
  });
});

export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["open", "resolved"].includes(status)) {
    throw new HttpError(400, "Status must be 'open' or 'resolved'");
  }

  const complaintId = Number(req.params.id);
  const { count } = await prisma.complaint.updateMany({
    where: { id: complaintId, restaurant: { adminId: req.user.id } },
    data: { status },
  });
  if (!count) {
    throw new HttpError(404, "Complaint not found");
  }

  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  res.json({ complaint: toSnakeCase(complaint) });
});
