import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
  getAllOrdersController,
  updateOrderStatusController,
  getAllCustomersController,
  getDashboardStatsController,
} from '../controllers/admin.controller';
import { upload } from '../middlewares/multer.middleware';

const adminRoute = Router();

adminRoute.post('/products', upload.array('images', 3), createProductController);
adminRoute.get('/products', getAllProductsController);
adminRoute.put('/products/:id', upload.array('images', 3), updateProductController);
adminRoute.delete('/products/:id', deleteProductController);

adminRoute.get('/orders', getAllOrdersController);
adminRoute.patch('/orders/:orderId/status', updateOrderStatusController);

adminRoute.get('/customers', getAllCustomersController);

adminRoute.get('/stats', getDashboardStatsController);

export default adminRoute;
