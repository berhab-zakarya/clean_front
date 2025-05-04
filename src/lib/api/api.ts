import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { ApiError, handleApiError } from './errorHandler';

const API_BASE_URL = 'https://api.algecom.com/v1';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const privateApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

privateApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
          throw new ApiError('No refresh token available', 401);
        }
        const response = await publicApi.post('/token/refresh/', { refresh: refreshTokenValue });
        const { access, refresh } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new ApiError('Session expired, please log in again', 401);
      }
    }
    return Promise.reject(error);
  }
);

export const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  data?: unknown,
  isPrivate: boolean = false
): Promise<T> => {
  try {
    const api = isPrivate ? privateApi : publicApi;
    const response = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new ApiError(error.response.data.message || 'API request failed', error.response.status);
    }
    throw handleApiError(error);
  }
};
