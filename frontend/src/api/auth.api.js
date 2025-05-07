import { api } from "./client.js";

export const signup = (payload) => api.post("/auth/signup", payload).then((res) => res.data);

export const login = (payload) => api.post("/auth/login", payload).then((res) => res.data);

export const verifyTwoFactor = (payload) =>
  api.post("/auth/verify-2fa", payload).then((res) => res.data);

export const refreshSession = () => api.post("/auth/refresh").then((res) => res.data);

export const logout = () => api.post("/auth/logout").then((res) => res.data);
