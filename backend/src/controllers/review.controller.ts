import { orderModel, productModel, reviewModel } from '../models';
import { IOrderItem } from '../models/order.model';
import { asyncHandler } from '../utils/asyncHandler';

export const createReviewController = asyncHandler(async (req, res) => {
  const { productId, orderId, rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  const user = req.user;

  const order = await orderModel.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.clerkId !== user.clerkId) {
    return res.status(403).json({ error: 'Not authorized to review this order' });
  }

  if (order.status !== 'delivered') {
    return res.status(400).json({ error: 'Can only review delivered orders' });
  }

  const productInOrder = order.orderItems.find(
    (item: IOrderItem) => item.product.toString() === productId.toString(),
  );
  if (!productInOrder) {
    return res.status(400).json({ error: 'Product not found in this order' });
  }

  const review = await reviewModel.findOneAndUpdate(
    { productId, userId: user._id },
    { rating, orderId, productId, userId: user._id },
    { new: true, upsert: true, runValidators: true },
  );

  const reviews = await reviewModel.find({ productId });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  const updatedProduct = await productModel.findByIdAndUpdate(
    productId,
    {
      averageRating: totalRating / reviews.length,
      totalReviews: reviews.length,
    },
    { new: true, runValidators: true },
  );

  if (!updatedProduct) {
    await reviewModel.findByIdAndDelete(review._id);
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(201).json({ message: 'Review submitted successfully', review });
}, 'createReviewController');

export const deleteReviewController = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const user = req.user;

  const review = await reviewModel.findById(reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (review.userId.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'Not authorized to delete this review' });
  }

  const productId = review.productId;
  await reviewModel.findByIdAndDelete(reviewId);

  const reviews = await reviewModel.find({ productId });
  const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
  await productModel.findByIdAndUpdate(productId, {
    averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
    totalReviews: reviews.length,
  });

  res.status(200).json({ message: 'Review deleted successfully' });
}, 'deleteReviewController');
