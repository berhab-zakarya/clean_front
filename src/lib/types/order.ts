export interface OrderItem {
  id: number;
  product_name: string;
  variant_details: string | null;
  quantity: number;
  price: string;
  total_price: string;
}

export interface Customer {
  id: number;
  name: string;
  phone_number: string;
  wilaya: number;
  wilaya_name: string;
  email: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: Customer;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  wilaya: string;
  address: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  shipping_fee: string;
  notes: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
} 