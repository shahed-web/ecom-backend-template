import { Router } from "express";
import {login, register} from "../controller/auth.controller.js";
import { authRequestValidator } from "../middleware/validator.middleware.js";

const router = Router();

router.post("/login", [authRequestValidator], login);
router.post("/register", [authRequestValidator], register);

export default router;