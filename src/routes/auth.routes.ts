import { Router } from "express";
import passport from "passport";
import {googleAuth, login, refreshTokenHandler, register} from "../controller/auth.controller.js";
import { authRequestValidator } from "../middleware/validator.middleware.js";

const router = Router();

router.post("/login", [authRequestValidator], login);
router.post("/register", [authRequestValidator], register);
router.get("/refreshtoken",  refreshTokenHandler)
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email']}));
router.get("/google/callback", passport.authenticate('google', {session: false}), googleAuth)

export default router;