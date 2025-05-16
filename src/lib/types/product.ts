export interface ProductMedia {
  file_url: string;
  file_type: string;
  alt_text: string;
  position: number;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  price: string;
  promotional_price: string;
  currency: string;
  stock_quantity: number;
  sku: string;
  category: number;
  is_featured: boolean;
  status: 'published' | 'draft' | 'archived';
  has_variants: boolean;
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



export interface ProductError {
  message: string;
  details?: Record<string, string[]>;
}

export interface ProductImage {
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  sku: string;
  price_adjustment: string;
  stock_quantity: number;
  attributes: Array<{
    attribute_id: number;
    value_id: number;
  }>;
}