import api from '@/lib/api/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';

export const storesAPI = {
  createStore: async (data: CreateStoreRequest): Promise<Store> => {
    try {
      const response = await api.post<Store>('/stores/', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create store');
    }
  },
};