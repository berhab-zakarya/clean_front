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
  deployment_status: string;
  email?: string;    // Optional since it's not in API response
  phone?: string;    // Optional since it's not in API response
}

export interface StoreApiError {
  message?: string;
  detail?: string;
  subdomain?: string[];
  errors?: Record<string, string[]>;
}