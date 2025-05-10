import api from '@/lib/api/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';
import type { StoreApiError } from '@/lib/types/store';
import axios from 'axios';
import { isLoggedIn } from '@/lib/auth/AuthContext'; 
export const storesAPI = {
  getStores: async (): Promise<Store[]> => {
    
    try {
      const response = await api.get<Store[]>('/stores/');
      console.log('API Response:', response.data);
      
      // تأكد من أن البيانات موجودة وصحيحة
      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data;
    } catch (error) {
      console.error('GetStores Error:', error);
      // رمي الخطأ للتعامل معه في المستوى الأعلى
      throw error;
    }
  },
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
  getCurrentStore: async (): Promise<Store> => {
    
    try {
      const response = await api.get<Store[]>('/stores/');
      console.log('Current Store Response:', response.data);
      
      if (!response.data || response.data.length === 0) {
        throw new Error('No store data received');
      }

      // Return the first store from the array
      return response.data[0];
    } catch (error) {
      console.error('GetCurrentStore Error:', error);
      throw error;
    }
  },
};