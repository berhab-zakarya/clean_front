import { useState, useEffect } from 'react';
import { plansAPI } from '@/lib/api/api'; 
import { Plan} from '@/lib/types/plans';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
  try {
    const plansData = await plansAPI.getPlans();
    console.log('Fetched plans:', plansData);

    setPlans(plansData);
    setError(null);
  } catch (err) {
    console.error('Error fetching plans:', err);
    setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
  } finally {
    setLoading(false);
  }
};


    fetchPlans();
  }, []);

  return { plans, loading, error };
};