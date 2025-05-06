import { useState, useCallback } from 'react';
import { productsAPI } from '@/lib/api/products/api';
import type { CreateProductRequest, Product } from '@/lib/types/product';
import type { Store } from '@/lib/types/store';

export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const storesList = await productsAPI.getStores();
      setStores(storesList);
      return storesList;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stores';
      setError(errorMessage);
      console.error('Store fetch failed:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData: CreateProductRequest): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!productData.tenant_id) {
        throw new Error('Store must be selected');
      }
      if (!productData.title?.trim()) {
        throw new Error('Product title is required');
      }
      if (productData.price <= 0) {
        throw new Error('Price must be greater than 0');
      }

      const product = await productsAPI.createProduct(productData);
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Product creation failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    stores,
    fetchStores,
    createProduct,
  };
}