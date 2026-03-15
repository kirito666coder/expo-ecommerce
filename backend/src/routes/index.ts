import { Router } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import authRouter from './auth.route';

const AllRoutes = Router();

AllRoutes.use(clerkMiddleware());

AllRoutes.use('/auth', requireAuth(), authRouter);

export default AllRoutes;
