import type { NextFunction, Request, Response } from "express";
import type { AuthRequest, AuthResponse } from "../controller/auth.controller";
import { FAILED_MESSAGES } from "../constant/messages";

export const authRequestValidator = (req: Request<{},{}, AuthRequest>, res: Response<AuthResponse>, next: NextFunction) => {
    const email: string = req.body.email;
    const password: string = req.body.password;     
    if(!email) {
        res.status(400).json({message: FAILED_MESSAGES.EMAIL_IS_REQUIRED});
        res.end()
        return; 
    }   
    if(!password) {
        res.status(400).json({message: FAILED_MESSAGES.PASSWORD_IS_REQUIRED});
        res.end()
        return; 
    } 
    next()
}