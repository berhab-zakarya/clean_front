export interface CreateStoreRequest {
  subdomain: string;
  store_name: string;
  store_type: 'pure' | 'hybrid';
}

export interface Store {
  id: number;
  subdomain: string;
  store_name: string;
  store_type: string;
  created_at: string;
  is_active: boolean;
  deployment_status: 'deploying' | 'deployed' | 'failed';
}