import { Router } from 'express';
import { createProductController } from '../controllers/admin.controller';

const adminRoute = Router();

adminRoute.post('/product', createProductController);

export default adminRoute;
