import { useState,useEffect } from 'react';
import { productsAPI } from '@/lib/api/api';
import type { CreateProductRequest, Product ,ProductError ,ProductImage ,ProductVariant} from '@/lib/types/product';


export function useProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProductError | null>(null);
  const [products, setProducts] = useState<Product[]>([]);


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

  const addProductImages = async (productId: number, images: ProductImage[]): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Adding images to product:', { productId, images });
      
      const response = await productsAPI.addProductImages(productId, images);
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
    try {
      setLoading(true);
      setError(null);

      console.log('Adding variants to product:', { productId, variants });
      
      const response = await productsAPI.addProductVariants(productId, variants);
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
    try {
      setLoading(true);
      const data = await productsAPI.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? { message: err.message } : { message: 'Failed to fetch products' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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