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
      // Add request data logging
      console.log('Making product creation request with data:', {
        ...data,
        media: data.media?.length || 0, // Log media count instead of full data
      });

      const response = await api.post<Product>('/products/', data, {
        headers: {
          'Content-Type': 'application/json',
          // Ensure auth token is present
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log the full error response
        console.error('Product API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });

        const apiError = error.response?.data as ProductApiError;

        // Handle 500 error specifically
        if (error.response?.status === 500) {
          throw new Error('Server error occurred. Please try again or contact support.');
        }

        // Handle validation errors
        if (apiError.errors) {
          const errorDetails: Record<string, string[]> = {};
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            errorDetails[field] = Array.isArray(messages) ? messages : [messages.toString()];
          });

          const error = new Error('Validation failed') as any;
          error.details = errorDetails;
          throw error;
        }

        // Handle other error types
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to create product'
        );
      }

      // Handle network errors
      throw new Error('Network error while creating product. Please check your connection.');
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