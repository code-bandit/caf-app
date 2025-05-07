import { api } from "./client.js";

export const listNotifications = () => api.get("/notifications").then((res) => res.data.notifications);

export const markRead = (id) => api.patch(`/notifications/${id}/read`).then((res) => res.data.notification);

export const markAllRead = () => api.patch("/notifications/read-all");
