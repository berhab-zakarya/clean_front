import { useState, useCallback, useEffect } from 'react';
import { storesAPI, categoriesAPI } from '@/lib/api/api';
import type { CreateStoreRequest, Store } from '@/lib/types/store';
import type { CreateCategoryRequest, Category } from '@/lib/types/category';

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
      console.log('Current store response:', store);

      if (store === null) {
        setHasStore(false);
        setUserStore(null);
        setStoreId(null);
        localStorage.removeItem('userStore');
        return false;
      }

      if (store && store.id) {
        setUserStore(store);
        setStoreId(store.id);
        setHasStore(true);
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
      setUserStore(null);
      setStoreId(null);
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

  const createCategory = async (data: CreateCategoryRequest, store: Store): Promise<Category | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const category = await categoriesAPI.createCategory(data, store);
      return category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      console.error('Category creation failed:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async (store: Store): Promise<Category[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const categories = await categoriesAPI.getCategories(store);
      return categories;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Categories fetch failed:', errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeStore = async () => {
      try {
        setLoading(true);
        // Try to get cached store first
        const cachedStore = localStorage.getItem('userStore');
        if (cachedStore) {
          try {
            const store = JSON.parse(cachedStore);
            console.log('Found cached store:', store);
            if (store.store_url) {
              setUserStore(store);
              setStoreId(store.id);
              setHasStore(true);
            } else {
              console.error('Cached store missing store_url:', store);
              localStorage.removeItem('userStore');
            }
          } catch (e) {
            console.error('Failed to parse cached store:', e);
            localStorage.removeItem('userStore');
          }
        }
        
        // Always verify with API
        const storeExists = await checkStoreExistence();
        console.log('Store existence check result:', storeExists);
        
        if (storeExists) {
          // Get all stores only if we have a valid store
          const stores = await getAllStores();
          console.log('Fetched all stores:', stores);
        }
      } catch (error) {
        console.error('Store initialization failed:', error);
        setError(error instanceof Error ? error.message : 'Failed to initialize store');
      } finally {
        setLoading(false);
      }
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
    createCategory,
    getCategories,
  };
}