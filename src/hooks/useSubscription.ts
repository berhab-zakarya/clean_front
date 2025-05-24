import { useState } from 'react';
import { subscriptionAPI } from '@/lib/api/api';
import { CreateSubscriptionRequest } from '@/lib/types/subscription';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const useSubscription = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const createSubscription = async (data: CreateSubscriptionRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Submitting subscription data:', data);
      const response = await subscriptionAPI.createSubscription(data);
      toast({
        title: "Success",
        description: response.message,
      });
      return response;
    } catch (err) {
      console.error('Subscription error details:', err);
      
      let errorMessage = 'Failed to create subscription';
      let errorTitle = 'Error';
      let errorVariant: 'default' | 'destructive' = 'destructive';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Handle specific error cases
        if (errorMessage.includes('already has an active or pending subscription')) {
          errorTitle = 'Active Subscription';
          errorMessage = 'You already have an active or pending subscription. Please manage your existing subscription first.';
          errorVariant = 'default';
        }
      } else if (axios.isAxiosError(err)) {
        const responseData = err.response?.data;
        if (typeof responseData === 'object' && responseData !== null) {
          errorMessage = responseData.detail || responseData.message || errorMessage;
        }
      }
      
      setError(errorMessage);
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: errorVariant,
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSubscription,
    isLoading,
    error,
  };
}; 