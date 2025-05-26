import { useState, useCallback, useEffect } from 'react';
import { storesAPI } from '@/lib/api/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';

export function useStore() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStore, setHasStore] = useState<boolean>(false);
  const [userStore, setUserStore] = useState<Store | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

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
      if (store && store.id) {
        setStoreId(store.id);
        setUserStore(store);
        setHasStore(true);
      }
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

  const getStore = useCallback(async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getCurrentStore();
      console.log('Store Response:', response); // Debug log

      if (response === null) {
        // User not authenticated, do not set error or clear store
        return null;
      }

      if (response && response.id) {
        setUserStore(response);
        setStoreId(response.id);
        setHasStore(true);
        return response;
      }
      return null;
    } catch (err) {
      console.error('Get store error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get store');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStoreExistence = useCallback(async () => {
    try {
      setLoading(true);
      const store = await storesAPI.getCurrentStore();

      if (store === null) {
        // User not authenticated, do not clear store or set error
        return false;
      }

      if (store && store.id) {
        setUserStore(store);
        setStoreId(store.id);
        setHasStore(true);

        // Cache the store data
        localStorage.setItem('userStore', JSON.stringify(store));

        return true;
      }

      setHasStore(false);
      setUserStore(null);
      setStoreId(null);
      localStorage.removeItem('userStore');
      return false;
    } catch (err) {
      console.error('Store existence check failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to check store existence');
      setHasStore(false);
      localStorage.removeItem('userStore');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getStores();
      if (Array.isArray(response)) {
        setStores(response);
      }
      return response;
    } catch (err) {
      console.error('Get all stores error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get stores');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStore = async (storeId: number, storeData: Partial<CreateStoreRequest>): Promise<Store | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (storeData.subdomain && !validateSubdomain(storeData.subdomain)) {
        throw new Error('Subdomain must be alphanumeric, optionally with hyphens, and between 1-63 characters');
      }

      const updatedStore = await storesAPI.updateStore(storeId, storeData);
      
      if (updatedStore) {
        // Update the store in state if it's the current user's store
        if (userStore?.id === storeId) {
          setUserStore(updatedStore);
          // Update cache
          localStorage.setItem('userStore', JSON.stringify(updatedStore));
        }
        
        // Update in stores list if it exists there
        setStores(prevStores => 
          prevStores.map(store => 
            store.id === storeId ? updatedStore : store
          )
        );
      }
      
      return updatedStore;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update store';
      setError(errorMessage);
      console.error('Store update failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeStore = async () => {
      // Try to get cached store first
      const cachedStore = localStorage.getItem('userStore');
      if (cachedStore) {
        try {
          const store = JSON.parse(cachedStore);
          setUserStore(store);
          setStoreId(store.id);
          setHasStore(true);
        } catch (e) {
          console.error('Failed to parse cached store:', e);
        }
      }
      
      // Always verify with API
      await checkStoreExistence();
      // Get all stores
      await getAllStores();
    };

    initializeStore();
  }, [checkStoreExistence, getAllStores]);

  return {
    loading,
    error,
    hasStore,
    userStore,
    storeId,
    stores,
    createStore,
    getStore,
    checkStoreExistence,
    getAllStores,
    updateStore,
  };
}