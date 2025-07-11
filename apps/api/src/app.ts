import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth/routes/auth.routes";
import userRoutes from "./users/routes/users.routes";
import adminRoutes from "./admin/routes/admin.routes";
import productRoutes from "./products/routes/products.routes";
import orderRoutes from "./orders/routes/orders.routes";
import paymentRoutes from "./payments/routes/payments.routes";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

export default app;
