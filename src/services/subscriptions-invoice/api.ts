import type { SubscriptionData, SubscriptionResponse } from '@/lib/types';

export async function submitSubscription(data: SubscriptionData): Promise<SubscriptionResponse> {
  try {
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Subscription request failed');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process subscription',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}