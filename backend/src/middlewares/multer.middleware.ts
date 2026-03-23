import type { Request } from 'express';
import type { Express } from 'express-serve-static-core';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;

  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg,jpg,png,webp)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
