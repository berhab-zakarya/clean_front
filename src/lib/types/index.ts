// File: src/types/index.ts

// User interface for authenticated user data
export interface User {
    id: number;
    email: string;
    role: string;
    role_name?: string; // Optional, as it may not always be returned (e.g., in login response)
    email_verified?: boolean; // Optional, used in profile responses
    created_at?: string; // Optional, used in profile responses (ISO date-time string)
    last_login_at?: string | null; // Optional, used in profile responses (ISO date-time string or null)
  }
  
  // Login response interface
  export interface LoginResponse {
    refresh: string;
    access: string;
    user: User;
  }
  
  // Refresh token response interface
  export interface RefreshTokenResponse {
    refresh: string;
    access: string;
  }
  
  // Registration response interface
  export interface RegisterResponse {
    message: string;
    user_id: number;
    email: string;
  }
  
  // Generic API response for actions like logout, password reset, email verification
  export interface ApiMessageResponse {
    message: string;
  }

  export type SpendingCategory = {
    id: string
    name: string
    amount: number
    color: string
  }
  
export type SpendingData = {
    categories: SpendingCategory[]
    totalSpending: number
  }

export interface SubscriptionData {
    cardHolderName: string;
    paymentMethod: string;
    billingAddress: {
      country: string;
      zipCode: string;
      city: string;
    };
    plan: {
      type: string;
      price: number;
      duration: number;
    };
    billingSameAsShipping: boolean;
    yearlyBilling: boolean;
  }
  
export type SubscriptionResponse = {
    success: boolean;
    message: string;
    subscriptionId?: string;
    error?: string;
  }