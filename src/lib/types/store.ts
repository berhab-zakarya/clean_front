export interface CreateStoreRequest {
  store_name: string;
  subdomain: string;
  store_type: string;
}

export interface Store {
  id: number;
  subdomain: string;
  store_name: string;
  store_type: string;
  created_at: string;
  is_active: boolean;
  deployment_status: 'deploying' | 'deployed' | 'failed';
  store_url?: string;
  message?: string;
}

export interface StoreApiError {
  message?: string;
  detail?: string;
  subdomain?: string[];
  errors?: Record<string, string[]>;
}