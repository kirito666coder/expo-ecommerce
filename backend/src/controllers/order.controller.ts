import { orderModel, productModel, reviewModel } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

export const createOrderController = asyncHandler(async (req, res) => {
  const user = req.user;
  const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ error: 'No order items' });
  }

  for (const item of orderItems) {
    const product = await productModel.findById(item.product._id);
    if (!product) {
      return res.status(404).json({ error: `Product ${item.name} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
  }

  const order = await orderModel.create({
    user: user._id,
    clerkId: user.clerkId,
    orderItems,
    shippingAddress,
    paymentResult,
    totalPrice,
  });

  for (const item of orderItems) {
    await productModel.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  res.status(201).json({ message: 'Order created successfully', order });
}, 'createOrderController');

export const getUserOrdersController = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({ clerkId: req.user.clerkId })
    .populate('orderItems.product')
    .sort({ createdAt: -1 });

  const orderIds = orders.map((order) => order._id);
  const reviews = await reviewModel.find({ orderId: { $in: orderIds } });
  const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()));

  const ordersWithReviewStatus = await Promise.all(
    orders.map(async (order) => {
      return {
        ...order.toObject(),
        hasReviewed: reviewedOrderIds.has(order._id.toString()),
      };
    }),
  );

  res.status(200).json({ orders: ordersWithReviewStatus });
}, 'getUserOrdersController');
