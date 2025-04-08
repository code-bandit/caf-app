import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import { notFound, errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import restaurantsRoutes from "./routes/restaurants.routes.js";
import menuItemsRoutes from "./routes/menuItems.routes.js";
import complaintsRoutes from "./routes/complaints.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/restaurants", restaurantsRoutes);
app.use("/api/menu-items", menuItemsRoutes);
app.use("/api/complaints", complaintsRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`caf-app backend listening on port ${port}`);
});
