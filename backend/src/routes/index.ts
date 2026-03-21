import { Router } from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import authRouter from './auth.route';
import { functions, inngest } from '../configs/inngest';
import { serve } from 'inngest/express';
import adminRoute from './admin.route';

const AllRoutes = Router();

AllRoutes.use(clerkMiddleware());

AllRoutes.use('/inngest', serve({ client: inngest, functions }));

AllRoutes.use('/auth', requireAuth(), authRouter);

AllRoutes.use('/admin', adminRoute);

export default AllRoutes;
