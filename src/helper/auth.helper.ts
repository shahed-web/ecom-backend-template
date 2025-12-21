import bcrypt from "bcrypt";
import jwt, {type JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/env.config";

export const hashString = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validateString = async (
  userPass: string,
  hashedPass: string
): Promise<boolean> => {
  return await bcrypt.compare(userPass, hashedPass);
};

export const encryptString = (text:string) : string => {
  return Buffer.from(text, 'utf8').toString('base64')
}

export const decryptString = (encoded: string):string => {
  return Buffer.from(encoded, 'base64').toString('utf8')
}


export interface UserDataPayload extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

interface User {
  id: number;
  email: string;
  role: string;
}

export const generateJWT = (
  userData: User,
  expiry: number
): string => {
  return jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    envConfig.JWT.JWT_SECRET_KEY,
    { expiresIn: expiry, algorithm: "HS256" }
  );
};

export const jwtVerify = (token: string): UserDataPayload => {
  return jwt.verify(
    token,
    envConfig.JWT.JWT_SECRET_KEY
  ) as UserDataPayload;
};


export const jwtDecode = (token:string): UserDataPayload => {
  return jwt.decode(token) as UserDataPayload
}