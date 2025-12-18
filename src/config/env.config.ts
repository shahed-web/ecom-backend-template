import dotenv from 'dotenv'

dotenv.config() 

interface EnvConfig {
  NODE_ENV: string
  PORT: number | Error
  JWT: {
    JWT_SECRET_KEY: string,
    ACCESS_TOKEN_EXPIRES_IN: number,
    REFRESH_TOKEN_EXPIRES_IN: number
  }
}

export const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV as string | 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : new Error("PORT is not defined at enviornment variable"), 
  JWT: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) as number,
    REFRESH_TOKEN_EXPIRES_IN: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) as number    
  }
}