export interface SubscriptionProfile {
  business_name: string;
  phone_number: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  frequency: 'monthly' | 'yearly';
  features: string;
  is_best_value: boolean;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: number;
  user: number;
  plan: SubscriptionPlan;
  start_date: string;
  end_date: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  payment_method: 'cash' | 'card' | 'bank_transfer';
  payment_status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface CreateSubscriptionRequest {
  profile: SubscriptionProfile;
  plan: {
    id: number;
  };
  billingSameAsShipping: boolean;
  yearlyBilling: boolean;
}

export interface CreateSubscriptionResponse {
  message: string;
  subscription: Subscription;
}

export interface SubscriptionApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
} 