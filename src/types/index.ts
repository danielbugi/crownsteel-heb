export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  image: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  variantId?: string | null;
  price: number;
  image: string;
  quantity: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  shippingAddress: any;
  billingAddress?: any;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}
