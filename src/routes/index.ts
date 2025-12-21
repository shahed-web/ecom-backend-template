import type { Application } from "express";
import authRoutes from "./auth.routes.js";
import prodcutRoutes from "./product.routes.js";

export default (app: Application) => {
    app.use("/api/auth", authRoutes);

    app.use("/api/product", prodcutRoutes); 
}