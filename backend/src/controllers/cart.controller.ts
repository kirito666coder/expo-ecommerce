import { cartModel, productModel } from '../models';
import { ICart } from '../models/cart.model';
import { asyncHandler } from '../utils/asyncHandler';

export const getCartController = asyncHandler(async (req, res) => {
  let cart = await cartModel.findOne({ clerkId: req.user.clerkId }).populate('items.product');

  if (!cart) {
    const user = req.user;

    cart = await cartModel.create({
      user: user._id,
      clerkId: user.clerkId,
      items: [],
    });
  }

  res.status(200).json({ cart });
}, 'getCartController');

export const addToCartController = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  let cart = await cartModel.findOne({ clerkId: req.user.clerkId });

  if (!cart) {
    const user = req.user;

    cart = await cartModel.create({
      user: user._id,
      clerkId: user.clerkId,
      items: [],
    });
  }

  const existingItem = cart.items.find((item: ICart) => item.product.toString() === productId);
  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (product.stock < newQuantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.status(200).json({ message: 'Item added to cart', cart });
}, 'addToCartController');

export const updateCartItemController = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1' });
  }

  const cart = await cartModel.findOne({ clerkId: req.user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = cart.items.findIndex((item: ICart) => item.product.toString() === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.status(200).json({ message: 'Cart updated successfully', cart });
}, 'updateCartItemController');

export const removeFromCartController = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await cartModel.findOne({ clerkId: req.user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = cart.items.filter((item: ICart) => item.product.toString() !== productId);
  await cart.save();

  res.status(200).json({ message: 'Item removed from cart', cart });
}, 'removeFromCartController');

export const clearCartController = asyncHandler(async (req, res) => {
  const cart = await cartModel.findOne({ clerkId: req.user.clerkId });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({ message: 'Cart cleared', cart });
}, 'clearCartController');
