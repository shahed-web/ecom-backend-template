import dotenv from 'dotenv'

dotenv.config() 

interface EnvConfig {
  NODE_ENV: string
  PORT: number
}

export const envConfig: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 2000, 
}