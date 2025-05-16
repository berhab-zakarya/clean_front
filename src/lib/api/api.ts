// services/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { Plan } from "../types/plans";
import { Store, CreateStoreRequest, StoreApiError } from "../types/store";
import { ProductApiError, CreateProductRequest, Product } from "../types/product";
import { Category, CreateCategoryRequest } from "../types/category";
import { Attribute, CreateAttributeRequest, AttributeValue, AddAttributeValuesRequest } from "../types/attribute";
import {
  User,
  UserProfile,
  AuthResponse,
  LoginCredentials,
  SignupData,
  UserProfileResponse,
  UpdateProfileData,
  ChangePasswordData,
  ChangePasswordResponse,
  RequestPasswordResetResponse
} from "../types/auth";
// Add this at the start of the file
const debug = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.error(...args);
    }
  },
};

// Change from https to http for local development
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";
// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an error interface
interface ApiError {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.config));
    }
  });
  failedQueue = [];
};

// Helper function to check if user is logged in
const isUserLoggedIn = () => {
  return !!(
    localStorage.getItem("access_token") &&
    localStorage.getItem("refresh_token") &&
    localStorage.getItem("user")
  );
};

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    debug.log("Request:", config.method?.toUpperCase(), config.url);
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    debug.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Update the response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt to refresh token if:
    // 1. Got a 401 error
    // 2. Request hasn't been retried yet
    // 3. User is logged in (has tokens and user data)
    // 4. It's not a token refresh request itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      isUserLoggedIn() &&
      !originalRequest.url?.includes("/token/refresh/")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Use direct axios call to avoid interceptors loop
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              // Don't include Authorization header here
            },
          }
        );

        if (refreshResponse.data && refreshResponse.data.access) {
          // Update tokens in localStorage
          localStorage.setItem("access_token", refreshResponse.data.access);
          
          if (refreshResponse.data.refresh) {
            localStorage.setItem("refresh_token", refreshResponse.data.refresh);
          }
          
          // Update default headers
          api.defaults.headers.common["Authorization"] = 
            `Bearer ${refreshResponse.data.access}`;
            
          // Update original request authorization header
          originalRequest.headers.Authorization = 
            `Bearer ${refreshResponse.data.access}`;
            
          isRefreshing = false;
          processQueue();
          
          // Retry the original request
          return api(originalRequest);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        
        // Clear auth data and redirect to login
        await authAPI.clearAuthData();
        
        // Only redirect to login if we're in a browser environment
        if (typeof window !== 'undefined') {
          window.location.href = "/login";
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // Log the request for debugging (redact sensitive data)
      debug.log("Sending login request:", {
        email: credentials.email,
        password: "[REDACTED]",
      });

      const response = await api.post<AuthResponse>(
        "/login/",
        // Make sure data is properly formatted
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Store tokens and user data in localStorage
      if (response.data.access && response.data.refresh && response.data.user) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Log the error response for debugging
        debug.error("Login error:", error.response?.data);

        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || "Login failed");
      }
      throw new Error("Network error during login");
    }
  },

  // Helper method to clear auth data
  clearAuthData: async (): Promise<void> => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  },

  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Already logged out
        return;
      }

      // First try to notify the server
      try {
        await api.post("/logout/", null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (serverError) {
        // Continue with local logout even if server logout fails
        debug.error(
          "Server logout failed, continuing with local logout:",
          serverError
        );
      }

      // Clear all auth data
      await authAPI.clearAuthData();
    } catch (error) {
      // Still clear auth data even if request fails
      await authAPI.clearAuthData();

      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(data?.detail || data?.message || "Logout failed");
      }
      throw new Error("Network error during logout");
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        debug.error("Error parsing user data:", e);
        return null;
      }
    }
    return null;
  },

  signup: async (credentials: SignupData): Promise<AuthResponse> => {
    try {
      debug.log("Sending signup request:", {
        ...credentials,
        password: "[REDACTED]",
        password_confirm: "[REDACTED]",
      });

      const response = await api.post<AuthResponse>("/register/", credentials, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      // Check for network errors first
      if (!axios.isAxiosError(error)) {
        throw new Error("Network error during signup");
      }

      if (error.code === "ERR_NETWORK") {
        throw new Error(
          "Unable to connect to the server. Please check your internet connection."
        );
      }

      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiError;
        const errorMessage =
          data.detail ||
          data.message ||
          Object.values(data.errors || {})
            .flat()
            .join(", ") ||
          "Registration failed";
        throw new Error(errorMessage);
      }

      throw new Error("An unexpected error occurred during signup");
    }
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse | null> => {
    // Check if user is logged in before attempting refresh
    if (!isUserLoggedIn()) {
      debug.log("Not refreshing token: User is not logged in");
      return null;
    }

    try {
      // Use direct axios call to avoid interceptor loops
      const response = await axios.post<AuthResponse>(
        `${API_BASE_URL}/token/refresh/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            // Don't include Authorization header here
          },
        }
      );

      if (!response.data.access) {
        throw new Error("No access token in response");
      }

      // Update token in localStorage
      localStorage.setItem("access_token", response.data.access);
      if (response.data.refresh) {
        localStorage.setItem("refresh_token", response.data.refresh);
      }

      // Update Authorization header
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      debug.error("Refresh error:", error instanceof Error ? error.message : 'Unknown error');
      // Clean up and log out
      await authAPI.clearAuthData();

      throw new Error("Could not refresh token");
    }
  },

  validateSession: async (): Promise<boolean> => {
    // First check if auth data exists locally
    if (!isUserLoggedIn()) {
      return false;
    }

    try {
      // Try to use the access token
      const response = await api.get("/profile/");
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (!refreshToken) return false;

          const response = await authAPI.refreshToken(refreshToken);
          return !!response?.access;
        } catch {
          await authAPI.clearAuthData();
          return false;
        }
      }
      return false;
    }
  },

  checkAuthStatus: async (): Promise<boolean> => {
    // Don't even try if we don't have the basics
    if (!isUserLoggedIn()) {
      return false;
    }

    // Try to validate the session
    try {
      return await authAPI.validateSession();
    } catch (error) {
      debug.error("Auth status check error:", error);
      return false;
    }
  },

  initializeAuth: async (router: any) => {
    try {
      const isAuthenticated = await authAPI.checkAuthStatus();
      if (isAuthenticated) {
        // If user is logged in, redirect to dashboard
        router.push("/dashboard");
        return true;
      }
      return false;
    } catch (error) {
      debug.error("Auth initialization error:", error);
      return false;
    }
  },

  updateProfile: async (
    data: UpdateProfileData
  ): Promise<UserProfileResponse> => {
    try {
      const response = await api.put<UserProfileResponse>("/profile/", data);

      // Update local storage with new user data
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(
          data?.detail || data?.message || "Failed to update profile"
        );
      }
      throw new Error("Network error during profile update");
    }
  },

  changePassword: async (
    data: ChangePasswordData
  ): Promise<ChangePasswordResponse> => {
    try {
      const response = await api.post<ChangePasswordResponse>(
        "/change-password/",
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(
          data?.detail || data?.message || "Failed to change password"
        );
      }
      throw new Error("Network error during password change");
    }
  },

  requestPasswordReset: async (
    email: string
  ): Promise<RequestPasswordResetResponse> => {
    try {
      const response = await api.post<RequestPasswordResetResponse>(
        "/password-reset/request/",
        {
          email: email,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as ApiError;
        throw new Error(
          data?.detail || data?.message || "Failed to send reset email"
        );
      }
      throw new Error("Network error during password reset request");
    }
  },
};


// --- Stores API ---
export const storesAPI = {
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await api.get<Store[]>('/stores/');
      debug.log('API Response:', response.data);
      if (!response.data) {
        throw new Error('No data received from API');
      }
      return response.data;
    } catch (error) {
      debug.error('GetStores Error:', error);
      throw error;
    }
  },
  createStore: async (data: CreateStoreRequest): Promise<Store> => {
    try {
      const response = await api.post<Store>('/stores/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as StoreApiError;
        if (apiError.subdomain?.[0]) {
          throw new Error(apiError.subdomain[0]);
        }
        const errorMessage =
          apiError?.message ||
          apiError?.detail ||
          Object.values(apiError?.errors || {}).flat().join(', ') ||
          'Failed to create store';
        debug.error('Store creation error:', {
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(errorMessage);
      }
      throw new Error('Network error while creating store');
    }
  },
  getCurrentStore: async (): Promise<Store> => {
    try {
      const response = await api.get<Store[]>('/stores/');
      debug.log('Current Store Response:', response.data);
      if (!response.data || response.data.length === 0) {
        throw new Error('No store data received');
      }
      return response.data[0];
    } catch (error) {
      debug.error('GetCurrentStore Error:', error);
      throw error;
    }
  },
};

// --- Products API ---
export const productsAPI = {
  getStores: async (): Promise<Store[]> => {
    try {
      const response = await api.get<Store[]>('/stores/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(apiError?.message || apiError?.detail || 'Failed to fetch stores');
      }
      throw new Error('Network error while fetching stores');
    }
  },
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      debug.log('Making product creation request with data:', {
        ...data,
        media: data.media?.length || 0,
      });

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<Product>('/api/v1/products/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        debug.error('Product API Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        const apiError = error.response?.data as ProductApiError;
        if (error.response?.status === 500) {
          throw new Error('Server error occurred. Please try again or contact support.');
        }
        if (apiError.errors) {
          const errorDetails: Record<string, string[]> = {};
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            errorDetails[field] = Array.isArray(messages) ? messages : [messages.toString()];
          });
          const errorObj = new Error('Validation failed') as any;
          errorObj.details = errorDetails;
          throw errorObj;
        }
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to create product'
        );
      }
      throw new Error('Network error while creating product. Please check your connection.');
    }
  },
  getProducts: async (): Promise<Product[]> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.get<Product[]>('/api/v1/products/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(apiError.message || 'Failed to fetch products');
      }
      throw new Error('Network error while fetching products');
    }
  },
  addProductImages: async (productId: number, images: Array<{
    image_url: string;
    alt_text: string;
    is_primary: boolean;
    sort_order: number;
  }>): Promise<Product> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<Product>(
        `/api/v1/products/${productId}/add_images/`,
        { images }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to add product images'
        );
      }
      throw new Error('Network error while adding product images');
    }
  },
  addProductVariants: async (productId: number, variants: Array<{
    sku: string;
    price_adjustment: string;
    stock_quantity: number;
    attributes: Array<{
      attribute_id: number;
      value_id: number;
    }>;
  }>): Promise<Product> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<Product>(
        `/api/v1/products/${productId}/add_variants/`,
        { variants }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to add product variants'
        );
      }
      throw new Error('Network error while adding product variants');
    }
  },
};

// --- Plans API ---
export const plansAPI = {
  getPlans: async (): Promise<Plan[]> => {
    try {
      const response = await api.get<Plan[]>('/plans/');
      return response.data;
    } catch (error) {
      debug.error('Error fetching plans:', error);
      throw new Error('Failed to fetch plans');
    }
  }
};

// --- Categories API ---
export const categoriesAPI = {
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<Category>('/api/v1/categories/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to create category'
        );
      }
      throw new Error('Network error while creating category');
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.get<Category[]>('/api/v1/categories/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch categories'
        );
      }
      throw new Error('Network error while fetching categories');
    }
  }
};

// --- Attributes API ---
export const attributesAPI = {
  createAttribute: async (data: CreateAttributeRequest): Promise<Attribute> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<Attribute>('/api/v1/attributes/', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to create attribute'
        );
      }
      throw new Error('Network error while creating attribute');
    }
  },

  getAttributes: async (): Promise<Attribute[]> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.get<Attribute[]>('/api/v1/attributes/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch attributes'
        );
      }
      throw new Error('Network error while fetching attributes');
    }
  },

  addAttributeValues: async (
    attributeId: number, 
    data: AddAttributeValuesRequest
  ): Promise<AttributeValue[]> => {
    try {
      // Get current store
      const store = await storesAPI.getCurrentStore();
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: store.store_url,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.post<AttributeValue[]>(
        `/api/v1/attributes/${attributeId}/add_values/`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to add attribute values'
        );
      }
      throw new Error('Network error while adding attribute values');
    }
  }
};

export default api;