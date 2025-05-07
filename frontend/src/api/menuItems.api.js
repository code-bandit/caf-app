import { api } from "./client.js";

export const listByRestaurant = (restaurantId, category) =>
  api
    .get(`/menu-items/restaurant/${restaurantId}`, { params: category ? { category } : {} })
    .then((res) => res.data.items);

export const getItem = (id) => api.get(`/menu-items/${id}`).then((res) => res.data.item);

export const listMine = () => api.get("/menu-items/mine").then((res) => res.data.items);

export const createItem = (payload) => api.post("/menu-items", payload).then((res) => res.data.item);

export const updateItem = (id, payload) =>
  api.patch(`/menu-items/${id}`, payload).then((res) => res.data.item);

export const deleteItem = (id) => api.delete(`/menu-items/${id}`);
