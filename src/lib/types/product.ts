export interface ProductMedia {
  file_url: string;
  file_type: string;
  alt_text: string;
  position: number;
}

export interface CreateProductRequest {
  tenant_id: number;
  title: string;
  description: string;
  price: number;
  price_discount?: number;
  discount?: number;
  status: 'exists' | 'draft' | 'archived';
  category: string;
  product_type: string;
  vendor: string;
  collections: string[];
  tags: string[];
  sku: string;
  inventory_quantity: number;
  available_quantity: number;
  requires_shipping: boolean;
  media: {
    file_url: string;
    file_type: string;
    alt_text: string;
    position: number;
  }[];
}

export interface Product extends CreateProductRequest {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface ProductApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}