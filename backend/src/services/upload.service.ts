import type { Express } from 'express';
import cloudinary from '../configs/cloudinary';

type CloudinaryImage = {
  url: string;
  public_id: string;
};

export const uploadImagesToCloudinary = async (
  files: Express.Multer.File[],
): Promise<CloudinaryImage[]> => {
  if (!files || files.length === 0) return [];

  if (files.length > 3) {
    throw new Error('Maximum 3 images allowed');
  }

  const uploadPromises = files.map((file) => {
    return new Promise<CloudinaryImage>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error || !result) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      });

      stream.end(file.buffer);
    });
  });

  return await Promise.all(uploadPromises);
};

export const deleteMultipleImagesFromCloudinary = async (public_ids: string[]): Promise<void> => {
  if (!public_ids || public_ids.length === 0) return;

  await cloudinary.api.delete_resources(public_ids);
};
