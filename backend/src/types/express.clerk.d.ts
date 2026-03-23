import { User } from '@clerk/types';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId?: string; sessionId?: string; claims?: any };
      clerkUser?: User;
      user: import('../models/user.model').IUser;
    }
  }
}
