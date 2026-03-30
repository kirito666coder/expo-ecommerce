import { Router } from 'express';
import { getAllProductsController } from '../controllers/admin.controller';
import { getProductByIdController } from '../controllers/product.controller';

const productRoute: Router = Router();

productRoute.get('/', getAllProductsController);
productRoute.get('/:id', getProductByIdController);

export default productRoute;
