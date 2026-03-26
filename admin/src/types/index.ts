export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: {
    url: string;
    public_id: string;
  }[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
};

export type OrderItem = {
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type ShippingAddress = {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
};

export type Order = {
  _id: string;
  user: User;
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered';
  paymentResult?: {
    id?: string;
    status?: string;
  };
  deliveredAt?: string;
  shippedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrdersResponse = {
  orders: Order[];
};

export type Stats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
};
