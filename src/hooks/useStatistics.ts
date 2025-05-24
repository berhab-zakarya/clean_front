import { useState, useCallback } from 'react';
import { statisticsAPI } from '../lib/api/api';
import { StatisticsPeriod } from '../lib/types/statistics';
import { useToast } from './use-toast';

export const useStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getSnapshots = useCallback(async (storeUrl: string, period?: StatisticsPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const data = await statisticsAPI.getSnapshots(storeUrl, period);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics snapshots';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getRealtimeStatistics = useCallback(async (storeUrl: string, period: StatisticsPeriod = 'daily') => {
    setLoading(true);
    setError(null);
    try {
      const data = await statisticsAPI.getRealtimeStatistics(storeUrl, period);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch realtime statistics';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    getSnapshots,
    getRealtimeStatistics,
  };
}; 