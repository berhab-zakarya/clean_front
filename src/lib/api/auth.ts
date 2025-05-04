import { User } from '../types';
import { apiRequest } from './api';

interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

interface RefreshTokenResponse {
  refresh: string;
  access: string;
}

export const login = async (credentials: { email: string; password: string }) => {
  return apiRequest<LoginResponse>('post', '/login/', credentials);
};

export const logout = async () => {
  return apiRequest<{ message: string }>('post', '/logout/', null, true);
};

export const register = async (data: {
  email: string;
  password: string;
  password_confirm: string;
  role: string;
}) => {
  return apiRequest<{ message: string; user_id: number; email: string }>('post', '/register/', data);
};

export const refreshToken = async (data: { refresh: string }) => {
  return apiRequest<RefreshTokenResponse>('post', '/token/refresh/', data);
};

export const requestPasswordReset = async (data: { email: string }) => {
  return apiRequest<{ message: string }>('post', '/password-reset/request/', data);
};

export const confirmPasswordReset = async (data: {
  token: string;
  password: string;
  password_confirm: string;
}) => {
  return apiRequest<{ message: string }>('post', '/password-reset/confirm/', data);
};

export const verifyEmail = async (data: { token: string }) => {
  return apiRequest<{ message: string }>('post', '/verify-email/', data);
};

export const getProfile = async () => {
  return apiRequest<User>('get', '/profile/', null, true);
};

export const updateProfile = async (data: Partial<User>) => {
  return apiRequest<User>('put', '/profile/', data, true);
};

export const partialUpdateProfile = async (data: Partial<User>) => {
  return apiRequest<User>('patch', '/profile/', data, true);
};
