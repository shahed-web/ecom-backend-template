import bcrypt from "bcrypt";
import jwt, {type JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/env.config";



export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  userPass: string,
  hashedPass: string
): Promise<boolean> => {
  return await bcrypt.compare(userPass, hashedPass);
};


export interface UserDataPayload extends JwtPayload {
  _id: string;
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
      _id: userData.id,
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
