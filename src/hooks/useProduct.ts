import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api/api';
import { useStorePath } from '@/hooks/useStorePath';
import type { CreateProductRequest, Product, ProductError, ProductImage, ProductVariant } from '@/lib/types/product';
import { storesAPI } from '@/lib/api/api';
import type { Store } from '@/lib/types/store';

export function useProduct() {
  const { currentStoreId } = useStorePath();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProductError | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);

  useEffect(() => {
    const fetchStore = async () => {
      if (currentStoreId) {
        try {
          const store = await storesAPI.getCurrentStore(currentStoreId);
          setCurrentStore(store);
        } catch (err) {
          console.error('Failed to fetch store:', err);
        }
      }
    };
    fetchStore();
  }, [currentStoreId]);

  const createProduct = async (productData: CreateProductRequest): Promise<Product | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting to create product with data:', productData);
      
      const response = await productsAPI.createProduct(productData, currentStore);
      console.log('Product creation successful:', response);
      return response;
    } catch (err) {
      console.error('Product creation failed:', err);
      
      if (err instanceof Error) {
        const errorWithDetails = err as Error & { details?: Record<string, string[]> };
        setError({ 
          message: err.message,
          details: errorWithDetails.details
        });
      } else {
        setError({ message: 'An unexpected error occurred' });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProductImages = async (productId: number, images: ProductImage[]): Promise<Product | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Adding images to product:', { productId, images });
      
      const response = await productsAPI.addProductImages(productId, images, currentStore);
      console.log('Images added successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to add product images:', err);
      
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to add product images' });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProductVariants = async (productId: number, variants: ProductVariant[]): Promise<Product | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Adding variants to product:', { productId, variants });
      
      const response = await productsAPI.addProductVariants(productId, variants, currentStore);
      console.log('Variants added successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to add product variants:', err);
      
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to add product variants' });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!currentStore) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      const data = await productsAPI.getProducts(currentStore);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? { message: err.message } : { message: 'Failed to fetch products' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStore) {
      fetchProducts();
    }
  }, [currentStore]);

  return {
    createProduct,
    addProductImages,
    addProductVariants,
    products, 
    refetch: fetchProducts,
    loading,
    error,
    clearError: () => setError(null)
  };
}