export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description: string;
  image_url?: string;
} 