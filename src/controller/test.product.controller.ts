import type { Request, Response } from 'express';
import { uploadToCloudinary } from '../service/cloudinary.service';

export const createProduct = async (req: Request, res: Response) => {
     try {
        const file = req.file as Express.Multer.File | undefined;
        if(!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        } else {   
            const result = await uploadToCloudinary(file.buffer);
            return res.status(200).json({ message: 'File uploaded successfully', url: result?.secure_url, public_id: result?.public_id  });
        }
     } catch (error) {
      return res.status(500).json({ message: 'Server Error', error });   
     }
}

export const testMultipleUpload = async (req: Request, res: Response) => {
    try {
        if(!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const files = req.files as Express.Multer.File[];
        const uploadPromises = files.map(file => uploadToCloudinary(file.buffer, 'test-multiple-products'));
        const uploadResults = await Promise.all(uploadPromises);
        return res.status(200).json({ message: 'Files uploaded successfully', uploads: uploadResults });
    }catch(error) {
        return res.status(500).json({ message: 'Server Error', error });   
    }
}