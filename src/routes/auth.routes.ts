import { Router } from "express";
import {login, refreshTokenHandler, register} from "../controller/auth.controller.js";
import { authRequestValidator } from "../middleware/validator.middleware.js";

const router = Router();

router.post("/login", [authRequestValidator], login);
router.post("/register", [authRequestValidator], register);
router.get("/refreshtoken",  refreshTokenHandler);

export default router;