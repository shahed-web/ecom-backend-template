import dotenv from 'dotenv'

dotenv.config() 

interface EnvConfig {
  NODE_ENV: string
  PORT: number | Error
  JWT: {
    JWT_SECRET_KEY: string,
    ACCESS_TOKEN_EXPIRES_IN: number,
    REFRESH_TOKEN_EXPIRES_IN: number
  },
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: string,
      CLIENT_SECRET: string,
      REDIRECT_URI: string
    }
  },
  CLOUDINARY: {
    CLOUD_NAME: string,
    API_KEY: string,
    API_SECRET: string
  }
}

export const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV as string | 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : new Error("PORT is not defined at enviornment variable"), 
  JWT: {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    ACCESS_TOKEN_EXPIRES_IN: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) as number,
    REFRESH_TOKEN_EXPIRES_IN: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) as number    
  },
  OAUTH:{
    GOOGLE: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      REDIRECT_URI : process.env.GOOGLE_REDIRECT_URI as string   
    }
  },
  CLOUDINARY: {
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    API_KEY: process.env.CLOUDINARY_API_KEY as string,
    API_SECRET: process.env.CLOUDINARY_API_SECRET as string
  }
}