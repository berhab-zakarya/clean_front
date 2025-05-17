// types/product.ts
export interface ProductColor {
  name: string;
  value: string;
  active: boolean;
}

export interface ProductSize {
  name: string;
  active: boolean;
}

export interface ProductReview {
  id: number;
  name: string;
  rating: number;
  date: string;
  content: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  discount?: string;
  rating: number;
  reviews: number;
  screenSize: string;
  colors: ProductColor[];
  sizes: ProductSize[];
  details: string[];
  reviewList: ProductReview[];
  faqs: ProductFAQ[];
}