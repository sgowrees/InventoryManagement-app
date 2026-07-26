export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  phone?: string;
  bio?: string;
}

export interface Product {
  _id: string;
  userId?: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  photo?: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
  byCategory: Record<string, number>;
}
