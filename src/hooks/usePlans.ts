import { useState, useEffect } from 'react';
import { plansAPI } from '@/lib/api/api'; 
import { Plan } from '@/lib/types/plans';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await plansAPI.getPlans();
        console.log('Fetched plans:', plansData);

        // Parse the features data
        const parsedPlans = plansData.map(plan => {
          if (typeof plan.features === 'string') {
            try {
              // Try to parse the string as JSON
              const parsedFeatures = JSON.parse(plan.features);
              // If it's an object with a features array, extract the array
              if (parsedFeatures && parsedFeatures.features && Array.isArray(parsedFeatures.features)) {
                return {
                  ...plan,
                  features: parsedFeatures.features
                };
              }
              // If it's just an array, use it directly
              if (Array.isArray(parsedFeatures)) {
                return {
                  ...plan,
                  features: parsedFeatures
                };
              }
              // If it's neither, wrap it in an array
              return {
                ...plan,
                features: [parsedFeatures]
              };
            } catch {
              // If parsing fails, treat it as a single feature
              return {
                ...plan,
                features: [plan.features]
              };
            }
          }
          return plan;
        });

        setPlans(parsedPlans);
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