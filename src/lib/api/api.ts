// services/api.ts
import axios, { AxiosRequestConfig } from "axios";
import { Plan } from "../types/plans";
import { Store, CreateStoreRequest, StoreApiError } from "../types/store";
import { ProductApiError, CreateProductRequest, Product, ProductImage, AddProductImageRequest } from "../types/product";
import { Category, CreateCategoryRequest } from "../types/category";
import { Attribute, CreateAttributeRequest, AttributeValue, AddAttributeValuesRequest } from "../types/attribute";
import {
  User,
  AuthResponse,
  LoginCredentials,
  SignupData,
  UserProfileResponse,
  UpdateProfileData,
  ChangePasswordData,
  ChangePasswordResponse,
  RequestPasswordResetResponse
} from "../types/auth";
import { StatisticsPeriod, StatisticsSnapshot, RealtimeStatistics, StatisticsApiError } from "../types/statistics";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { 
  CreateSubscriptionRequest, 
  CreateSubscriptionResponse, 
  SubscriptionApiError 
} from "../types/subscription";
import { Order, OrderApiError } from "../types/order";
import { FileTreeResponse } from "../types/files";
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
  withCredentials: true, // Enable sending cookies with requests
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

// Add request interceptor to include auth token and CSRF token in requests
api.interceptors.request.use(
  (config) => {
    debug.log("Request:", config.method?.toUpperCase(), config.url);
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // For POST, PUT, DELETE requests, include CSRF token from cookie
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    return config;
  },
  (error) => {
    debug.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

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

  initializeAuth: async (router: AppRouterInstance) => {
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

// Add this helper function before the storesAPI definition
const ensurePort8000 = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // If port exists and is not 8000, change it to 8000
    if (urlObj.port && urlObj.port !== '8000') {
      urlObj.port = '8000';
    }
    return urlObj.toString();
  } catch (error) {
    debug.error('Error parsing URL:', error);
    return url;
  }
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
      // Ensure all store URLs use port 8000
      response.data = response.data.map(store => ({
        ...store,
        store_url: store.store_url ? ensurePort8000(store.store_url) : store.store_url
      }));
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
  updateStore: async (storeId: number, data: Partial<CreateStoreRequest>): Promise<Store> => {
    try {
      const response = await api.patch<Store>(`/stores/${storeId}/`, data);
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
          'Failed to update store';
        debug.error('Store update error:', {
          status: error.response?.status,
          data: error.response?.data
        });
        throw new Error(errorMessage);
      }
      throw new Error('Network error while updating store');
    }
  },
  getCurrentStore: async (storeId?: string): Promise<Store> => {
    try {
      const response = await api.get<Store[]>('/stores/');
      debug.log('Current Store Response:', response.data);
      if (!response.data || response.data.length === 0) {
        throw new Error('No store data received');
      }
      
      if (storeId) {
        const store = response.data.find(s => s.id.toString() === storeId);
        if (!store) {
          throw new Error('Store not found');
        }
        return store;
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
  createProduct: async (data: CreateProductRequest, store: Store): Promise<Product> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      debug.log('Making product creation request with data:', {
        ...data,
      });

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      // First create the product without images
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        promotional_price: data.promotional_price,
        currency: data.currency,
        stock_quantity: data.stock_quantity,
        sku: data.sku,
        category: data.category,
        is_featured: data.is_featured,
        status: data.status,
        has_variants: data.has_variants,
        faqs: data.faqs
      };

      const response = await storeApi.post<Product>('/api/v1/products/', productData);

      // Wait for 10 seconds before adding images
      await new Promise(resolve => setTimeout(resolve, 10000));

      // If there are images, add them to the product
      if (data.images && data.images.length > 0) {
        const formData = new FormData();
        
        // Add each image file to the form data
        data.images.forEach((image) => {
          // Add file with the correct field name
          formData.append('images', image.file);
          formData.append('alt_texts', image.alt_text || '');
          formData.append('is_primary', String(image.is_primary || false));
          formData.append('sort_orders', String(image.sort_order || 0));
        });

        // Add images to the product
        await storeApi.post<ProductImage[]>(
          `/api/v1/products/${response.data.id}/add_images/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
          }
        );

        // Fetch the updated product to get the images
        const updatedProduct = await storeApi.get<Product>(`/api/v1/products/${response.data.id}/`);
        return updatedProduct.data;
      }

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
            errorDetails[field] = Array.isArray(messages) ? messages : [String(messages)];
          });
          const errorObj = new Error('Validation failed') as Error & { details: Record<string, string[]> };
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
  addProductImage: async (productId: number, imageData: AddProductImageRequest, store: Store): Promise<ProductImage> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const formData = new FormData();
      formData.append('file', imageData.file);
      formData.append('alt_text', imageData.alt_text);
      formData.append('is_primary', String(imageData.is_primary));
      formData.append('sort_order', String(imageData.sort_order));

      const response = await storeApi.post<ProductImage>(
        `/api/v1/products/${productId}/add_images/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to add product image'
        );
      }
      throw new Error('Network error while adding product image');
    }
  },
  getProducts: async (store: Store): Promise<Product[]> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
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
    image: string;
    alt_text: string;
    is_primary: boolean;
  }>, store: Store): Promise<Product> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
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
  }>, store: Store): Promise<Product> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Validate variants before sending
      if (!Array.isArray(variants) || variants.length === 0) {
        throw new Error('No variants provided');
      }

      // Validate each variant
      variants.forEach((variant, index) => {
        if (!variant.sku) {
          throw new Error(`Variant at index ${index} is missing SKU`);
        }
        if (typeof variant.stock_quantity !== 'number' || variant.stock_quantity < 0) {
          throw new Error(`Variant at index ${index} has invalid stock quantity`);
        }
        if (!Array.isArray(variant.attributes) || variant.attributes.length === 0) {
          throw new Error(`Variant at index ${index} has no attributes`);
        }
        variant.attributes.forEach((attr, attrIndex) => {
          if (typeof attr.attribute_id !== 'number' || attr.attribute_id <= 0) {
            throw new Error(`Variant at index ${index} has invalid attribute_id at position ${attrIndex}`);
          }
          if (typeof attr.value_id !== 'number' || attr.value_id <= 0) {
            throw new Error(`Variant at index ${index} has invalid value_id at position ${attrIndex}`);
          }
        });
      });

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      console.log('Sending variants data:', { variants });

      const response = await storeApi.post<Product>(
        `/api/v1/products/${productId}/add_variants/`,
        { variants }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        console.error('Variant API Error:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        
        // Handle validation errors
        if (error.response?.status === 400) {
          const errorMessage = apiError?.detail || 
            (apiError?.errors && Object.entries(apiError.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ')) ||
            'Invalid variant data';
          throw new Error(errorMessage);
        }
        
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to add product variants'
        );
      }
      throw error; // Re-throw non-Axios errors
    }
  },
  deleteProduct: async (productId: number, store: Store): Promise<void> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      await storeApi.delete(`/api/v1/products/${productId}/`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to delete product'
        );
      }
      throw new Error('Network error while deleting product');
    }
  },
  updateProduct: async (productId: number, data: Partial<CreateProductRequest>, store: Store): Promise<Product> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.patch<Product>(`/api/v1/products/${productId}/`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ProductApiError;
        if (error.response?.status === 500) {
          throw new Error('Server error occurred. Please try again or contact support.');
        }
        if (apiError.errors) {
          const errorDetails: Record<string, string[]> = {};
          Object.entries(apiError.errors).forEach(([field, messages]) => {
            errorDetails[field] = Array.isArray(messages) ? messages : [String(messages)];
          });
          const errorObj = new Error('Validation failed') as Error & { details: Record<string, string[]> };
          errorObj.details = errorDetails;
          throw errorObj;
        }
        throw new Error(
          apiError?.message || 
          apiError?.detail || 
          'Failed to update product'
        );
      }
      throw new Error('Network error while updating product');
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
  createCategory: async (data: CreateCategoryRequest, store: Store): Promise<Category> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
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

  getCategories: async (store: Store): Promise<Category[]> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
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
  createAttribute: async (data: CreateAttributeRequest, store: Store): Promise<Attribute> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      // Validate required fields
      if (!data.name || !data.slug) {
        throw new Error('Name and slug are required for attribute creation');
      }

      // Only send name and slug
      const requestData = {
        name: data.name.trim(),
        slug: data.slug.trim()
      };

      // Log the request data for debugging
      console.log('Making attribute creation request with data:', requestData);
      console.log('Request URL:', `${ensurePort8000(store.store_url)}/api/v1/attributes/`);
      console.log('Request headers:', storeApi.defaults.headers);

      const response = await storeApi.post<Attribute>('/api/v1/attributes/', requestData);
      
      // Log the response for debugging
      console.log('Attribute creation response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error) {
      console.error('Attribute creation error:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        const errorMessage = apiError?.detail || 
          apiError?.message || 
          (error.response?.status === 500 ? 'Server error occurred. Please try again.' : 'Failed to create attribute');
        throw new Error(errorMessage);
      }
      throw new Error('Network error while creating attribute');
    }
  },

  getAttributes: async (): Promise<Attribute[]> => {
    try {
      // Get current store
      const currentStore = await storesAPI.getCurrentStore();
      if (!currentStore?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(currentStore.store_url),
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
    data: AddAttributeValuesRequest,
    store: Store
  ): Promise<AttributeValue[]> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
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

// --- Files API ---
interface FileContentResponse {
  path: string;
  content: string;
}

export const filesAPI = {
  getStoreFiles: async (subdomain: string): Promise<FileTreeResponse> => {
    try {
      const response = await api.get<FileTreeResponse>(`/tenants/${subdomain}/files/`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch store files'
        );
      }
      throw new Error('Network error while fetching store files');
    }
  },

  getFileContent: async (subdomain: string, filePath: string): Promise<FileContentResponse> => {
    try {
      const response = await api.get<FileContentResponse>(`/api/tenants/${subdomain}/files`, {
        params: {
          path: filePath
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch file content'
        );
      }
      throw new Error('Network error while fetching file content');
    }
  },

  updateFileContent: async (subdomain: string, filePath: string, content: string): Promise<FileContentResponse> => {
    try {
      const response = await api.post<FileContentResponse>(`/tenants/files/${subdomain}/`, {
        path: filePath,
        content: content
      });
      return response.data;
    } catch (error) {
      console.error('UpdateFileContent Error:', error);
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to update file content'
        );
      }
      throw new Error('Network error while updating file content');
    }
  }
};

// --- Statistics API ---
export const statisticsAPI = {
  getSnapshots: async (storeUrl: string, period?: StatisticsPeriod): Promise<StatisticsSnapshot[]> => {
    try {
      if (!storeUrl) {
        throw new Error('Store URL not found');
      }
      const storeApi = axios.create({
        baseURL: ensurePort8000(storeUrl),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const response = await storeApi.get<StatisticsSnapshot[]>('/api/v1/statistics/snapshots/', {
        params: period ? { period } : undefined
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as StatisticsApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch statistics snapshots'
        );
      }
      throw new Error('Network error while fetching statistics snapshots');
    }
  },

  getRealtimeStatistics: async (storeUrl: string, period: StatisticsPeriod = 'daily'): Promise<RealtimeStatistics> => {
    try {
      if (!storeUrl) {
        throw new Error('Store URL not found');
      }
      const storeApi = axios.create({
        baseURL: ensurePort8000(storeUrl),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      const response = await storeApi.get<RealtimeStatistics>('/api/v1/statistics/realtime/', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as StatisticsApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch realtime statistics'
        );
      }
      throw new Error('Network error while fetching realtime statistics');
    }
  }
};

// --- Subscription API ---
export const subscriptionAPI = {
  createSubscription: async (data: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
    try {
      debug.log('Creating subscription with data:', data);
      const response = await api.post<CreateSubscriptionResponse>('/subscription/', data);
      debug.log('Subscription response:', response.data);
      return response.data;
    } catch (error) {
      debug.error('Subscription creation error:', error);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        debug.error('Server error response:', responseData);
        
        // Handle different types of error responses
        if (typeof responseData === 'object' && responseData !== null) {
          // Handle non-field errors (like "User already has an active subscription")
          if (responseData.non_field_errors && Array.isArray(responseData.non_field_errors)) {
            throw new Error(responseData.non_field_errors[0]);
          }

          const apiError = responseData as SubscriptionApiError;
          const errorMessage = 
            apiError?.detail || 
            apiError?.message || 
            (apiError?.errors && Object.entries(apiError.errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ')) ||
            'Failed to create subscription';
          throw new Error(errorMessage);
        }
        
        // If we have a status code but no detailed message
        if (error.response?.status) {
          throw new Error(`Server error (${error.response.status}): ${error.response.statusText}`);
        }
      }
      throw new Error('Network error while creating subscription');
    }
  }
};

// --- Orders API ---
export const ordersAPI = {
  getOrders: async (store: Store): Promise<Order[]> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.get<Order[]>('/api/v1/orders/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as OrderApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to fetch orders'
        );
      }
      throw new Error('Network error while fetching orders');
    }
  },

  updateOrderStatus: async (store: Store, orderId: number, status: string): Promise<Order> => {
    try {
      if (!store?.store_url) {
        throw new Error('Store URL not found');
      }

      // Create a new axios instance with store URL as base
      const storeApi = axios.create({
        baseURL: ensurePort8000(store.store_url),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      const response = await storeApi.patch<Order>(`/api/v1/orders/${orderId}/update_status/`, {
        status
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as OrderApiError;
        throw new Error(
          apiError?.detail || 
          apiError?.message || 
          'Failed to update order status'
        );
      }
      throw new Error('Network error while updating order status');
    }
  }
};

export default api;