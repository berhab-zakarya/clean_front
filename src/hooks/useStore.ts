import { useState, useCallback } from 'react';
import { storesAPI } from '@/lib/api/stores/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';

export function useStore() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStore, setHasStore] = useState<boolean>(false);
  const [userStore, setUserStore] = useState<Store | null>(null);

  const validateSubdomain = (subdomain: string): boolean => {
    // Subdomain must be alphanumeric, optionally with hyphens, 1-63 characters
    const subdomainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    return subdomainRegex.test(subdomain);
  };

  const createStore = async (storeData: CreateStoreRequest): Promise<Store | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!storeData.store_name?.trim()) {
        throw new Error('Store name is required');
      }

      if (!storeData.subdomain?.trim()) {
        throw new Error('Subdomain is required');
      }

      if (!validateSubdomain(storeData.subdomain)) {
        throw new Error('Subdomain must be alphanumeric, optionally with hyphens, and between 1-63 characters');
      }

      const store = await storesAPI.createStore(storeData);
      return store;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create store';
      setError(errorMessage);
      console.error('Store creation failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkStoreExistence = useCallback(async () => {
    try {
      setLoading(true);
      const stores = await storesAPI.getStores();
      console.log('Received stores:', stores);

      // Since the API returns an array, we'll take the first store
      const store = stores[0];
      const hasExistingStore = !!store;

      setHasStore(hasExistingStore);
      if (hasExistingStore) {
        setUserStore(store);
      } else {
        setUserStore(null);
      }

      return hasExistingStore;
    } catch (err) {
      console.error('Store check error:', err);
      setError(err instanceof Error ? err.message : 'Failed to check store existence');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    hasStore,
    userStore,
    createStore,
    checkStoreExistence,
  };
}