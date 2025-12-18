import {type Request, type Response} from 'express';
import { prisma } from '../lib/prisma';

interface AuthRequest {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token?: string;
}

export const login = async (req: Request<{},{}, AuthRequest>, res: Response<AuthResponse>) => {
    try {
        const email: string = req.body.email;
        const password: string = req.body.password;
        if(!email || !password) {
            res.status(400).json({message: 'Email and password are required'});
            res.end()
            return; 
        }   
        const user = await prisma.user.create({
            data: {
                email: email,  
                password: password
            }
        });
        res.status(200).json({message: 'Login successful'});    
        res.end()
        return 
    }catch(error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'});
        res.end()
        return; 
    }
}