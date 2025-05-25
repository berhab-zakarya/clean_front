import { useState, useEffect } from 'react';
import { ordersAPI, storesAPI } from '@/lib/api/api';
import { Order } from '@/lib/types/order';
import { Store } from '@/lib/types/store';
import { useStorePath } from '@/hooks/useStorePath';
import { useToast } from '@/hooks/use-toast';

export const useOrders = () => {
  const { currentStoreId } = useStorePath();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStore, setCurrentStore] = useState<Store | null>(null);
  const { toast } = useToast();

  // Fetch store data when currentStoreId changes
  useEffect(() => {
    const fetchStore = async () => {
      if (currentStoreId) {
        try {
          const store = await storesAPI.getCurrentStore(currentStoreId);
          setCurrentStore(store);
        } catch (err) {
          console.error('Failed to fetch store:', err);
          setError('Failed to fetch store data');
        }
      }
    };
    fetchStore();
  }, [currentStoreId]);

  const fetchOrders = async () => {
    if (!currentStore) {
      setError('No store selected');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getOrders(currentStore);
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStore) {
      fetchOrders();
    }
  }, [currentStore]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
}; 