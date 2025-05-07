import { api } from "./client.js";

export const listRestaurants = () => api.get("/restaurants").then((res) => res.data.restaurants);

export const getRestaurant = (id) => api.get(`/restaurants/${id}`).then((res) => res.data.restaurant);

export const getMyRestaurant = () => api.get("/restaurants/mine").then((res) => res.data.restaurant);

export const updateMyRestaurant = (payload) =>
  api.patch("/restaurants/mine", payload).then((res) => res.data.restaurant);
