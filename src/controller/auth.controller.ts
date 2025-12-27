import _ from 'lodash';
import {type Request, type Response} from 'express';
import { prisma } from '../lib/prisma';
import { ERROR_MESSAGES, FAILED_MESSAGES, SUCCESS_MESSAGES } from '../constant/messages';
import { decryptString, encryptString, generateJWT, hashString, issueToken, jwtDecode, jwtVerify, validateString, type TokenPair, type UserDataPayload } from '../helper/auth.helper';
import { envConfig } from '../config/env.config';

export interface AuthRequest {
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
        const generatedHashedPassword: string = await hashString(password);

        const existingUser =  await prisma.user.findUnique({
            where: {
                email: email
            }
        }); 

        if (existingUser && !existingUser.password) {
            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    password: generatedHashedPassword
                }
            })
            const userData = _.pick(existingUser, ["id", "email", "role"]);
            const {accessToken, refreshToken} = await issueToken(userData as UserDataPayload)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN * 1000
            }).cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN * 1000
            });
            res.status(200).json({message: SUCCESS_MESSAGES.USER_CREATED});    
            return
        }

        if (existingUser) {
            res.status(400).json({message: FAILED_MESSAGES.USER_EXISTS});
            return
        } 

        const newUser = await prisma.user.create({
            data: {
                email: email,  
                password: generatedHashedPassword
            }
        });

        const userData = _.pick(newUser, ["id", "email", "role"]);
        const {accessToken, refreshToken} = await issueToken(userData as UserDataPayload)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN * 1000
        }).cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN * 1000
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

        if (existingUser && !existingUser.password) {
            res.status(400).json({message: FAILED_MESSAGES.LOGIN_FAILED_USE_SOCIAL_AUTH});
            return
        }
        
        if (existingUser && existingUser.password) {
            const isPasswordValid: boolean = await validateString(password, existingUser.password);

            if (!isPasswordValid) {
                res.status(400).json({message: FAILED_MESSAGES.INVALID_CREDENTIALS});
                return
            }   

            const userData = _.pick(existingUser, ["id", "email", "role"]);

            const { accessToken, refreshToken } = await issueToken(userData as UserDataPayload)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN * 1000
            }).cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN * 1000
            }); 
            res.status(200).json({message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL});    
            return
        }

        if (!existingUser) {
            res.status(400).json({message: FAILED_MESSAGES.INVALID_EMAIL_ADDRESS});
            return
        }     
 
    }catch(error) {
        console.error(error)
        res.status(500).json({message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR});
        return; 
    }
}

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const refreshToken: string | null = req.cookies.refreshToken
    if(!refreshToken) {
        return res.status(401).send({
            message: FAILED_MESSAGES.UNAUTHORIZED
        })   
    }
    try {
        const tokenPayload = jwtDecode(refreshToken) as UserDataPayload
        const userId: number = tokenPayload.id as number
        const storedToken = await prisma.refreshToken.findFirst({
            where: {
                userId: userId
            }
        })
        const decryptedStoredToken = storedToken ? decryptString(storedToken.hashedToken) : null
        
        if(!storedToken || decryptedStoredToken !== refreshToken) {
            return res.status(401).send({
                message: FAILED_MESSAGES.UNAUTHORIZED
            })   
        }   

        if(storedToken.expiresAt.getTime() < Date.now()) {
            await prisma.refreshToken.deleteMany({
                where: {
                    userId: userId
                }
            })  
            return res.status(401).send({message: FAILED_MESSAGES.UNAUTHORIZED})
        }
        if (!jwtVerify(refreshToken)) return res.status(401).send({message: FAILED_MESSAGES.UNAUTHORIZED})       
        const newAccessToken = generateJWT(tokenPayload, envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN)
        return res.status(200).send({message: SUCCESS_MESSAGES.NEW_ACCESS_TOKEN, token: newAccessToken})
    } catch(error) {      
        console.log(error)
        return res.status(401).send({
            message:FAILED_MESSAGES.UNAUTHORIZED
        })
    }   
}

export const googleAuth = (req: Request, res: Response) => {
    const { accessToken, refreshToken } = req.user as any;
    res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: envConfig.JWT.REFRESH_TOKEN_EXPIRES_IN * 1000
        })
        .cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: envConfig.JWT.ACCESS_TOKEN_EXPIRES_IN * 1000
        })
        .status(200).send({message: SUCCESS_MESSAGES.LOGIN_SUCCESSFUL});
        // res.redirect("http://localhost:3000/api/auth/google/callback");
}