import { Router } from 'express';
import { createProduct } from '../controllers/admin.controller';

const adminRoute = Router();

adminRoute.post('/product', createProduct);

export default adminRoute;
