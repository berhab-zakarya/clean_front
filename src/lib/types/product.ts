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
  price: number;
  promotional_price: number;
  currency: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  category: number;
  status: 'published' | 'draft' | 'archived';
  has_variants: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  promotional_price: string | null;
  currency: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  category: number;
  status: 'published' | 'draft' | 'archived';
  has_variants: boolean;
  is_sale: boolean;
  current_price: string;
  average_rating: string;
  category_name: string;
  primary_image: string | null;
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