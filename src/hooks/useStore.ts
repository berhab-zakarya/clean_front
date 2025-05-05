import { useState } from 'react';
import { storesAPI } from '@/services/stores/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';

export function useStore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStore = async (storeData: CreateStoreRequest): Promise<Store | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const store = await storesAPI.createStore(storeData);
      return store;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create store');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createStore,
  };
}