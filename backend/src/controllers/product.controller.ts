import { productModel } from '../models';
import { asyncHandler } from '../utils/asyncHandler';

export const getProductByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  res.status(200).json(product);
}, 'getProductByIdController');
