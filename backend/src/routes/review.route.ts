import { Router } from 'express';
import { createReviewController, deleteReviewController } from '../controllers/review.controller';

const reviewRoute = Router();

reviewRoute.post('/', createReviewController);
reviewRoute.delete('/:reviewId', deleteReviewController);

export default reviewRoute;
