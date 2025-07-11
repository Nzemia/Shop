import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth/routes/auth.routes";
import userRoutes from "./users/routes/users.routes";
import adminRoutes from "./admin/routes/admin.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

export default app;
