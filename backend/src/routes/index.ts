import { Router } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from '../configs/inngest';
import { serve } from 'inngest/express';
import adminRoute from './admin.route';
import { adminOnly, protectRouteMiddleware } from '../middlewares/auth.middleware';
import cartRoute from './cart.route';

const AllRoutes = Router();

AllRoutes.use(clerkMiddleware());

AllRoutes.use('/inngest', serve({ client: inngest, functions }));

AllRoutes.use('/admin', protectRouteMiddleware, adminOnly, adminRoute);

AllRoutes.use('/cart', protectRouteMiddleware, cartRoute);

export default AllRoutes;
