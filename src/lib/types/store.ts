export interface CreateStoreRequest {
  store_name: string;
  subdomain: string;
  store_type: string;
}

export interface Store {
  id: string;
  store_name: string;
  subdomain: string;
  store_type: string;
  created_at: string;
  is_active: boolean;
  deployment_status: 'deploying' | 'deployed' | 'failed';
}

export interface StoreApiError {
  message?: string;
  detail?: string;
  subdomain?: string[];
  errors?: Record<string, string[]>;
}