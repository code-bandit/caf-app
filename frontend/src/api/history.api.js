import { api } from "./client.js";

export const createHistoryEntry = (payload) => api.post("/history", payload).then((res) => res.data.entry);

export const listMyHistory = () => api.get("/history/mine").then((res) => res.data.history);

export const listRestaurantHistory = () => api.get("/history/restaurant").then((res) => res.data.history);
