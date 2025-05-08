import { useState } from 'react';
import { productsAPI } from '@/lib/api/products/api';
import type { CreateProductRequest, Product } from '@/lib/types/product';

interface ProductError {
  message: string;
  details?: Record<string, string[]>;
}

export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProductError | null>(null);

  const createProduct = async (productData: CreateProductRequest): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // Add debug log
      console.log('Attempting to create product with data:', productData);
      
      const response = await productsAPI.createProduct(productData);
      console.log('Product creation successful:', response);
      return response;
    } catch (err) {
      console.error('Product creation failed:', err);
      
      // Handle structured error response
      if (err instanceof Error) {
        setError({ 
          message: err.message,
          details: (err as any).details
        });
      } else {
        setError({ message: 'An unexpected error occurred' });
      }
      
      throw err; // Re-throw to allow handling in components
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    loading,
    error,
    clearError: () => setError(null)
  };
}