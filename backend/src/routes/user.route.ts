import { Router } from 'express';
import {
  addAddressController,
  addToWishlistController,
  deleteAddressController,
  getAddressesController,
  getWishlistController,
  removeFromWishlistController,
  updateAddressController,
} from '../controllers/user.controller';

const userRoute = Router();

userRoute.post('/addresses', addAddressController);
userRoute.get('/addresses', getAddressesController);
userRoute.put('/addresses/:addressId', updateAddressController);
userRoute.delete('/addresses/:addressId', deleteAddressController);

userRoute.post('/wishlist', addToWishlistController);
userRoute.delete('/wishlist/:productId', removeFromWishlistController);
userRoute.get('/wishlist', getWishlistController);

export default userRoute;
