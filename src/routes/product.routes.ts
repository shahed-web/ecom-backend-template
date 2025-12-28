import { Router } from "express";
import { checkAdmin, checkAuth } from "../middleware/auth.middleware.js";
import { createProduct, testMultipleUpload } from "../controller/test.product.controller.js";
import cloudUpload from "../middleware/multer.middleware.js";

const router = Router();    

router.post("/test-img-upload", cloudUpload.single("image"), createProduct)
router.post("/test-multi-img-upload", cloudUpload.array("images", 5), testMultipleUpload)

export default router;