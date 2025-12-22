import _ from "lodash";
import type { Request, Response, NextFunction } from 'express';
import { FAILED_MESSAGES } from '../constant/messages';
import {jwtVerify } from '../helper/auth.helper';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        email: string
      };
    }
  }
}


export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken: string = req.cookies.accessToken;
        if (!accessToken) return res.status(403).send({message: FAILED_MESSAGES.ACCESS_TOKEN_MISSING})
        const userPayload = jwtVerify(accessToken)
        req.user = _.pick(userPayload, ["id", "email", "role"])
        next()
    }catch(error) {
        console.log(error)
        return res.status(401).send({message: FAILED_MESSAGES.UNAUTHORIZED})
    }
    
}

export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(!user || user.role != "ADMIN") {
        return res.status(401).send({message: FAILED_MESSAGES.UNAUTHORIZED})
    }
    next()
}