import cloudinary from "../config/cloudinary.config";
import streamifier from "streamifier";
import type {UploadApiResponse, UploadApiErrorResponse} from 'cloudinary'

export const uploadToCloudinary = (buffer: Buffer, folder: string = 'test-products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        {                
            folder: folder,
            resource_type: 'image'
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (error) reject(error);
            else resolve(result);
        }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
