import { Request, Response, NextFunction } from 'express';
import logger from '../libs/logger';

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
  context: string,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      logger.error(`Error in ${context}`, error);
      next(error);
    });
  };
};
