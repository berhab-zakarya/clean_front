import { useState } from 'react';
import { productsAPI } from '@/lib/api/products/api';
import type { CreateProductRequest, Product } from '@/lib/types/product';

export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: CreateProductRequest): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsAPI.createProduct(productData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error
  };
}