import _ from 'lodash';
import {type Request, type Response} from 'express';
import { prisma } from '../lib/prisma';
import { ERROR_MESSAGES, FAILED_MESSAGES, SUCCESS_MESSAGES } from '../constant/messages';
import { generateJWT, hashPassword, validatePassword } from '../helper/auth.helper';
import { envConfig } from '../config/env.config';

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  refreshToken?: string;
}

export const register = async (req: Request<{},{}, AuthRequest>, res: Response<AuthResponse>) => {
    try {
        const email: string = req.body.email;
        const password: string = req.body.password;       

        const existingUser =  await prisma.user.findUnique({
            where: {
                email: email
            }
        }); 

        if (existingUser) {
            res.status(400).json({message: FAILED_MESSAGES.USER_EXISTS});
            return
        }   

        const generatedHashedPassword: string = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email: email,  
                password: generatedHashedPassword
            }
        });

        // generate token
        const userData = _.pick(newUser, ["id", "email", "role"]);
        const accessToken: string =  generateJWT(userData, envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN);
        const refreshToken: string =  generateJWT(userData, envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.status(201).json({message: SUCCESS_MESSAGES.USER_CREATED});    
        return  

    }catch(error) {
        console.error(error)
        res.status(500).json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
        return; 
    }   
}

export const login = async (req: Request<{},{}, AuthRequest>, res: Response<AuthResponse>) => {
    try {
        const email: string = req.body.email;
        const password: string = req.body.password;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        
        if (!existingUser) {
            res.status(400).json({message: FAILED_MESSAGES.INVALID_EMAIL_ADDRESS});
            return
        }     

        const isPasswordValid: boolean = await validatePassword(password, existingUser.password);

        if (!isPasswordValid) {
            res.status(400).json({message: FAILED_MESSAGES.INVALID_CREDENTIALS});
            return
        }   
        // generate token
        const userData = _.pick(existingUser, ["id", "email", "role"]);
        const accessToken: string =  generateJWT(userData, envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN);
        const refreshToken: string =  generateJWT(userData, envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        }); 
        res.status(200).json({message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL});    
        return 
    }catch(error) {
        console.error(error)
        res.status(500).json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
        return; 
    }
}