import type { Application } from "express";
import authRoutes from "./auth.routes.js";

export default (app: Application) => {
    app.use("/api/auth", authRoutes); 
}