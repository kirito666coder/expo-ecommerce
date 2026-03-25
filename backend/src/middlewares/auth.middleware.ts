import { getAuth } from '@clerk/express';
import { NextFunction, Request, Response } from 'express';
import { userModel } from '../models';
import { ENV } from '../configs/env';
import logger from '../libs/logger';

export const protectRouteMiddleware = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = getAuth(req);
      const clerkId = auth.userId;

      if (!clerkId) return res.status(401).json({ message: 'unauthorized - invalid token' });

      const user = await userModel.findOne({ clerkId });
      if (!user) return res.status(404).json({ message: 'User not found' });

      req.user = user;
      next();
    } catch (error) {
      logger.error('Error in protectRoute middleware', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - user not found' });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Forbidden - admin access only' });
  }

  next();
};
