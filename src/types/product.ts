export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tags: string[];
  tag: string;
  category: string;
  created_at: string;
  is_active: boolean;
}

export interface Profile {
  id: string;
  phone:number;
  name: string;
  age: number;
  gender: string;
  email: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}