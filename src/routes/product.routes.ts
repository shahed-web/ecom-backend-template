import { Router } from "express";
import { createProduct } from "../controller/product.controller.js";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware.js";

const router = Router();    

router.get("/protected-product", [checkAuth], createProduct)
router.get("/protected-admin", [checkAuth, checkAdmin], createProduct)

export default router;