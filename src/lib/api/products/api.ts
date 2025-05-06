import api from '@/lib/api/api';
import type { CreateProductRequest, Product } from '@/lib/types/product';
import type { ProductApiError } from '@/lib/types/product';
import type { Store } from '@/lib/types/store';
import axios from 'axios';

export const productsAPI = {
  // Get store info
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await api.get<Store[]>('/stores/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(apiError?.message || apiError?.detail || 'Failed to fetch stores');
      }
      throw new Error('Network error while fetching stores');
    }
  },

  // Create product
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    try {
      const response = await api.post<Product>('/products/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        console.error('Product creation error:', {
          status: error.response?.status,
          data: error.response?.data
        });

        // Handle specific field errors
        if (apiError.errors) {
          const fieldErrors = Object.entries(apiError.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
          throw new Error(`Validation errors:\n${fieldErrors}`);
        }

        // Handle general errors
        const errorMessage = 
          apiError?.message || 
          apiError?.detail ||
          'Failed to create product';

        throw new Error(errorMessage);
      }
      throw new Error('Network error while creating product');
    }
  },

  // Get products
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/products/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(apiError.message || 'Failed to fetch products');
      }
      throw new Error('Network error while fetching products');
    }
  },
};