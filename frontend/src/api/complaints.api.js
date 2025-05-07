import { api } from "./client.js";

export const createComplaint = (payload) => api.post("/complaints", payload).then((res) => res.data.complaint);

export const listMyComplaints = () => api.get("/complaints/mine").then((res) => res.data.complaints);

export const listRestaurantComplaints = () =>
  api.get("/complaints/restaurant").then((res) => res.data.complaints);

export const updateComplaintStatus = (id, status) =>
  api.patch(`/complaints/${id}/status`, { status }).then((res) => res.data.complaint);
