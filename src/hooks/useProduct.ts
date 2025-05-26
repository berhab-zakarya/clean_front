import { useState, useEffect } from 'react';
import { productsAPI } from '@/lib/api/api';
import { useStorePath } from '@/hooks/useStorePath';
import type { CreateProductRequest, Product, ProductError, ProductImage, ProductVariant } from '@/lib/types/product';
import { storesAPI } from '@/lib/api/api';
import type { Store } from '@/lib/types/store';
import { AddProductImageRequest } from '@/lib/types/product';
import { attributesAPI } from '@/lib/api/api';
import { Attribute, AttributeValue } from '@/lib/types/attribute';
import { CreateAttributeRequest } from '@/lib/types/attribute';
import { useToast } from './use-toast';

export function useProduct() {
  const { currentStoreId } = useStorePath();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ProductError | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const { toast } = useToast();

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

  const addProductImage = async (productId: number, imageData: AddProductImageRequest): Promise<ProductImage | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Adding image to product:', { productId, imageData });
      
      const response = await productsAPI.addProductImage(productId, imageData, currentStore);
      console.log('Image added successfully:', response);
      return response;
    } catch (err) {
      console.error('Failed to add product image:', err);
      
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to add product image' });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createAttribute = async (data: { name: string; slug: string; description?: string }): Promise<Attribute | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    setLoading(true);
    setError(null);
    try {
      // Ensure required fields are present and properly formatted
      const attributeData: CreateAttributeRequest = {
        name: data.name.trim(),
        slug: data.slug.trim(),
      };
      
      console.log('Creating attribute with data:', attributeData);
      const result = await attributesAPI.createAttribute(attributeData, currentStore);
      if (!result) {
        throw new Error('No response received from server');
      }
      return result;
    } catch (err) {
      console.error('Error creating attribute:', err);
      if (err instanceof Error) {
        setError({ message: err.message });
      } else {
        setError({ message: 'Failed to create attribute' });
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addAttributeValues = async (
    attributeId: number, 
    values: string[]
  ): Promise<AttributeValue[] | null> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await attributesAPI.addAttributeValues(attributeId, {
        values: values.map(value => ({
          value,
          color_code: '',
          image_url: ''
        }))
      }, currentStore);
      return result;
    } catch (err) {
      setError(err instanceof Error ? { message: err.message } : { message: 'Failed to add attribute values' });
      return null;
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

  const deleteProduct = async (productId: number): Promise<void> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);
      
      await productsAPI.deleteProduct(productId, currentStore);
      
      // Update local products state
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (err) {
      console.error('Failed to delete product:', err);
      
      if (err instanceof Error) {
        setError({ message: err.message });
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        setError({ message: 'Failed to delete product' });
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    productId: number,
    data: Partial<CreateProductRequest>
  ): Promise<Product> => {
    if (!currentStore) {
      throw new Error('No store selected');
    }

    try {
      setLoading(true);
      setError(null);
      
      const updatedProduct = await productsAPI.updateProduct(productId, data, currentStore);
      
      // Update local products state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? updatedProduct : p)
      );
      
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      return updatedProduct;
    } catch (err) {
      console.error('Failed to update product:', err);
      
      if (err instanceof Error) {
        const errorWithDetails = err as Error & { details?: Record<string, string[]> };
        setError({ 
          message: err.message,
          details: errorWithDetails.details
        });
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        setError({ message: 'Failed to update product' });
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    addProductImage,
    addProductVariants,
    deleteProduct,
    updateProduct,
    products, 
    refetch: fetchProducts,
    loading,
    error,
    clearError: () => setError(null),
    createAttribute,
    addAttributeValues
  };
}