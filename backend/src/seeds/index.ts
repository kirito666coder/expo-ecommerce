import mongoose from 'mongoose';
import { ENV } from '../configs/env';
import { productModel } from '../models';

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and travelers.',
    price: 149,
    stock: 50,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
    ],
    averageRating: 4.5,
    totalReviews: 128,
  },
  {
    name: 'Smart Watch Series 5',
    description:
      'Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist.',
    price: 299,
    stock: 35,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    ],
    averageRating: 4.7,
    totalReviews: 256,
  },
  {
    name: 'Leather Crossbody Bag',
    description:
      'Handcrafted genuine leather bag with adjustable strap. Features multiple compartments and elegant design perfect for daily use.',
    price: 89,
    stock: 25,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
    ],
    averageRating: 4.3,
    totalReviews: 89,
  },
  {
    name: 'Running Shoes - Pro Edition',
    description:
      'Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for performance and comfort during long runs.',
    price: 129,
    stock: 60,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500',
    ],
    averageRating: 4.6,
    totalReviews: 342,
  },
  {
    name: 'Bestselling Mystery Novel',
    description:
      'A gripping psychological thriller that will keep you on the edge of your seat. New York Times bestseller with over 1 million copies sold.',
    price: 24,
    stock: 100,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    ],
    averageRating: 4.8,
    totalReviews: 1243,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and durable design. Perfect for outdoor adventures.',
    price: 79,
    stock: 45,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500',
    ],
    averageRating: 4.4,
    totalReviews: 167,
  },
  {
    name: 'Classic Denim Jacket',
    description:
      'Timeless denim jacket with vintage wash and comfortable fit. A wardrobe essential that pairs perfectly with any outfit.',
    price: 69,
    stock: 40,
    category: 'Fashion',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500',
    ],
    averageRating: 4.2,
    totalReviews: 95,
  },
  {
    name: 'Yoga Mat Pro',
    description:
      'Extra-thick non-slip yoga mat with carrying strap. Eco-friendly material provides excellent cushioning and grip for all yoga styles.',
    price: 49,
    stock: 75,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
    ],
    averageRating: 4.5,
    totalReviews: 203,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description:
      'Gaming keyboard with customizable RGB lighting, mechanical switches, and programmable keys. Built for gamers and typing enthusiasts.',
    price: 119,
    stock: 30,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    ],
    averageRating: 4.7,
    totalReviews: 421,
  },
  {
    name: 'Coffee Table Book Collection',
    description:
      'Stunning photography book featuring architecture and design from around the world. Hardcover edition with 300+ pages of inspiration.',
    price: 39,
    stock: 55,
    category: 'Books',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500',
    ],
    averageRating: 4.6,
    totalReviews: 134,
  },
  {
    name: 'Noise Cancelling Earbuds',
    description:
      'Compact in-ear earbuds with active noise cancellation and 20-hour battery life. Ideal for commuting and workouts.',
    price: 99,
    stock: 70,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1595844660740-8b6e7c93d636?w=500',
      'https://images.unsplash.com/photo-1600185365835-fd9c99b3a8c0?w=500',
    ],
    averageRating: 4.4,
    totalReviews: 210,
  },
  {
    name: 'Smart Home Security Camera',
    description:
      '1080p HD indoor/outdoor security camera with motion detection, night vision, and two-way audio.',
    price: 129,
    stock: 40,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=500',
      'https://images.unsplash.com/photo-1598300052710-228f9df6f382?w=500',
    ],
    averageRating: 4.6,
    totalReviews: 198,
  },
  {
    name: 'Eco-Friendly Water Bottle',
    description:
      'Stainless steel reusable water bottle, keeps drinks cold for 24 hours and hot for 12 hours.',
    price: 29,
    stock: 120,
    category: 'Sports',
    images: [
      'https://images.unsplash.com/photo-1596811992039-6c85ef9b30f2?w=500',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
    ],
    averageRating: 4.7,
    totalReviews: 310,
  },
  {
    name: 'Luxury Candle Set',
    description:
      'Set of 3 scented candles with premium soy wax. Perfect for home ambiance and gifting.',
    price: 49,
    stock: 60,
    category: 'Home',
    images: [
      'https://images.unsplash.com/photo-1618220642407-1b2f8ff2e1f1?w=500',
      'https://images.unsplash.com/photo-1618220642388-2f17f0a91434?w=500',
    ],
    averageRating: 4.5,
    totalReviews: 95,
  },
  {
    name: 'Adjustable Laptop Stand',
    description:
      'Ergonomic aluminum laptop stand with adjustable height and angle. Ideal for home office setup.',
    price: 59,
    stock: 50,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500',
      'https://images.unsplash.com/photo-1612832020477-5406d518b0e8?w=500',
    ],
    averageRating: 4.6,
    totalReviews: 180,
  },
];

const seedDatabase = async () => {
  try {
    if (!ENV.DB_URL) return console.log('❌ DB_URL is not configured');
    await mongoose.connect(ENV.DB_URL);
    console.log('✅ Connected to MongoDB');

    await productModel.deleteMany({});
    console.log('🗑️  Cleared existing products');

    await productModel.insertMany(products);
    console.log(`✅ Successfully seeded ${products.length} products`);

    const categories = [...new Set(products.map((p) => p.category))];
    console.log('\n📊 Seeded Products Summary:');
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories: ${categories.join(', ')}`);

    await mongoose.connection.close();
    console.log('\n✅ Database seeding completed and connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
