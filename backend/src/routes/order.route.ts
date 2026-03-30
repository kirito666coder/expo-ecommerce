import { Router } from 'express';
import { createOrderController, getUserOrdersController } from '../controllers/order.controller';

const orderRoute: Router = Router();

orderRoute.post('/', createOrderController);
orderRoute.get('/', getUserOrdersController);

export default orderRoute;
