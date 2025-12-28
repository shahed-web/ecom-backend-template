import { v2 as cloudinary } from "cloudinary";
import { envConfig } from "./env.config";

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY.CLOUD_NAME,
  api_key: envConfig.CLOUDINARY.API_KEY,
  api_secret: envConfig.CLOUDINARY.API_SECRET
});

export default cloudinary;