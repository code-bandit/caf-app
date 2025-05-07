import { api } from "./client.js";

export const getMe = () => api.get("/users/me").then((res) => res.data.user);

export const updateMe = (payload) => api.patch("/users/me", payload).then((res) => res.data.user);
