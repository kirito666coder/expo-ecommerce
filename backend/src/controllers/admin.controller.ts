import type { Express } from 'express-serve-static-core';
import { asyncHandler } from '../utils/asyncHandler';
import {
  deleteMultipleImagesFromCloudinary,
  uploadImagesToCloudinary,
} from '../services/upload.service';
import { productModel } from '../models';

export const createProductController = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  if (!name || !description || !price || !stock || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  if (files.length > 3) {
    return res.status(400).json({ message: 'Maximum 3 images allowed' });
  }

  const images = await uploadImagesToCloudinary(files);

  const product = await productModel.create({
    name,
    description,
    price: parseFloat(price),
    stock: parseFloat(stock),
    category,
    images,
  });

  res.status(201).json(product);
}, 'createProductController');

export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await productModel.find().sort({ createdAt: -1 });
  res.status(200).json(products);
}, 'getAllProductsController');

export const updateProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category } = req.body;

  const product = await productModel.findById(id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = parseFloat(price);
  if (stock !== undefined) product.stock = parseInt(stock);
  if (category) product.category = category;

  const files = req.files as Express.Multer.File[];

  if (!files) {
    return res.status(400).json({ message: 'At least one image is required' });
  }

  if (files.length > 3) {
    return res.status(400).json({ message: 'Maximum 3 images allowed' });
  }

  const publicIds = product.images.map((img: { public_id: string }) => img.public_id);
  await deleteMultipleImagesFromCloudinary(publicIds);

  const images = await uploadImagesToCloudinary(files);
  if (images) product.images = images;

  await product.save();
  res.status(200).json(product);
}, 'updateProductController');

export const deleteProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const publicIds = product.images.map((img: { public_id: string }) => img.public_id);
  await deleteMultipleImagesFromCloudinary(publicIds);

  await product.deleteOne();

  res.status(200).json({ message: 'Product delete successfully' });
}, 'deleteProductController');

// export const getAllOrdersController = asyncHandler(async(req,res)=>{},'getAllOrdersController');

// export const updateOrderStatusController = asyncHandler(async(req,res)=>{},'updateOrderStatusController');

// export const getAllCustomersController = asyncHandler(async(req,res)=>{},'getAllCustomersController');

// export const getDashboardStatsController = asyncHandler(async(req,res)=>{},'getDashboardStatsController');
