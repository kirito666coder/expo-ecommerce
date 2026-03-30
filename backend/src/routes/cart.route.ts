import { Router } from 'express';
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeFromCartController,
  updateCartItemController,
} from '../controllers/cart.controller';

const cartRoute: Router = Router();

cartRoute.get('/', getCartController);
cartRoute.post('/', addToCartController);
cartRoute.put('/:productId', updateCartItemController);
cartRoute.delete('/:productId', removeFromCartController);
cartRoute.delete('/', clearCartController);

export default cartRoute;
