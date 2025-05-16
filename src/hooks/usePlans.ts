import { useState, useEffect } from 'react';
import { plansAPI } from '@/lib/api/api'; 
import { Plan, ParsedPlan} from '@/lib/types/plans';

export const usePlans = () => {
  const [plans, setPlans] = useState<ParsedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await plansAPI.getPlans();
        
        // Parse the features JSON string for each plan
        const parsedPlans = plansData.map(plan => ({
          ...plan,
          features: JSON.parse(plan.features)
        }));

        setPlans(parsedPlans);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};