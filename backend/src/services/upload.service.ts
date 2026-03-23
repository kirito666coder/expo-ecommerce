import type { Express } from 'express-serve-static-core';
import cloudinary from '../configs/cloudinary';

export const uploadImagesToCloudinary = async (files: Express.Multer.File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  if (files.length > 3) {
    throw new Error('Maximum 3 images allowed');
  }

  const uploadPromises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      });

      stream.end(file.buffer);
    });
  });

  return await Promise.all(uploadPromises);
};
