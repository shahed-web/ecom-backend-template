import _ from 'lodash'
import {type Request, type Response} from 'express';
import { prisma } from '../lib/prisma';
import { ERROR_MESSAGES, FAILED_MESSAGES, SUCCESS_MESSAGES } from '../constant/messages';
import { hashPassword, validatePassword } from '../helper/auth.helper';

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
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
            res.end()
            return; 
        }   

        const generatedHashedPassword: string = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email: email,  
                password: generatedHashedPassword
            }
        });

        // generate token
        res.status(201).json({message: SUCCESS_MESSAGES.USER_CREATED});    
        res.end()
        return  

    }catch(error) {
        console.error(error)
        res.status(500).json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
        res.end()
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
            res.status(400).json({message: FAILED_MESSAGES.USER_NOT_FOUND});
            res.end()
            return; 
        }     

        const isPasswordValid: Boolean = await validatePassword(password, existingUser["password"]);

        if (!isPasswordValid) {
            res.status(400).json({message: FAILED_MESSAGES.INVALID_PASSWORD});
            res.end()
            return; 
        }   
        // generate token
        res.status(200).json({message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL});    
        res.end()
        return 
    }catch(error) {
        console.error(error)
        res.status(500).json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
        res.end()
        return; 
    }
}