export interface CreateStoreRequest {
  store_name: string;
  subdomain: string;
  store_type: string;
}

export interface StoreConfig {
  url: string;
  deployed_at: string;
  store_type: string;
  local_port: number;
  pid: number | null;
  store_name: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  primary_light: string;
  primary_dark: string;
}

export interface Store {
  id: number;
  subdomain: string;
  store_name: string;
  store_type: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  deployment_status: 'deploying' | 'deployed' | 'failed';
  deployment_log: string;
  store_url: string;
  store_config: StoreConfig;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  description: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  whatsapp_number: string | null;
  social_links: Record<string, string | null>;
  theme_colors: ThemeColors;
}

export interface StoreApiError {
  message?: string;
  detail?: string;
  subdomain?: string[];
  errors?: Record<string, string[]>;
}