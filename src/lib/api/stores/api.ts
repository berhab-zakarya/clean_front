import api from '@/lib/api/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';
import type { StoreApiError } from '@/lib/types/store';
import axios from 'axios';

export const storesAPI = {
  createStore: async (data: CreateStoreRequest): Promise<Store> => {
    try {
      const response = await api.post<Store>('/stores/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as StoreApiError;
        
        // Handle specific subdomain validation error
        if (apiError.subdomain?.[0]) {
          throw new Error(apiError.subdomain[0]);
        }
        
        // Handle other error formats
        const errorMessage = 
          apiError?.message || 
          apiError?.detail ||
          Object.values(apiError?.errors || {}).flat().join(', ') ||
          'Failed to create store';

        console.error('Store creation error:', {
          status: error.response?.status,
          data: error.response?.data
        });

        throw new Error(errorMessage);
      }
      throw new Error('Network error while creating store');
    }
  },
};