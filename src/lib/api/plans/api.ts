import api from '@/lib/api/api';
import { Plan } from './types';

export const plansAPI = {
  getPlans: async (): Promise<Plan[]> => {
    try {
      const response = await api.get<Plan[]>('/plans/');
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw new Error('Failed to fetch plans');
    }
  }
};