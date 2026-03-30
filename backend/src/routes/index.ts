import { Router } from 'express';
import { clerkMiddleware } from '@clerk/express';
import { functions, inngest } from '../configs/inngest';
import { serve } from 'inngest/express';
import adminRoute from './admin.route';
import { adminOnly, protectRouteMiddleware } from '../middlewares/auth.middleware';
import cartRoute from './cart.route';
import orderRoute from './order.route';
import productRoute from './product.route';
import reviewRoute from './review.route';
import userRoute from './user.route';

const AllRoutes: Router = Router();

AllRoutes.use(clerkMiddleware());

AllRoutes.use('/inngest', serve({ client: inngest, functions }));

AllRoutes.use('/admin', protectRouteMiddleware, adminOnly, adminRoute);

AllRoutes.use('/users', protectRouteMiddleware, userRoute);

AllRoutes.use('/cart', protectRouteMiddleware, cartRoute);

AllRoutes.use('/orders', protectRouteMiddleware, orderRoute);

AllRoutes.use('/products', protectRouteMiddleware, productRoute);

AllRoutes.use('/reviews', protectRouteMiddleware, reviewRoute);

export default AllRoutes;
