
import axios, { AxiosError } from 'axios';
import { toast, ToastOptions as ToastifyOptions } from 'react-toastify';


export const ToastOptions = {
  ERROR: {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
  } as ToastifyOptions,
  SUCCESS: {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
  } as ToastifyOptions,
  INFO: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
  } as ToastifyOptions,
  WARNING: {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
  } as ToastifyOptions
};

export const ErrorMessages = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
  ACCOUNT_LOCKED: 'Your account has been locked due to too many failed attempts.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  EMPTY_FIELDS: 'Please fill in all required fields.',
  INVALID_EMAIL: 'Please enter a valid email address.',
};

export function showErrorToast(message: string) {
  toast.error(message, ToastOptions.ERROR);
}

export function showSuccessToast(message: string) {
  toast.success(message, ToastOptions.SUCCESS);
}


export function handleLoginErrorWithToast(error: unknown): void {
  const errorMessage = getLoginErrorMessage(error);
  showErrorToast(errorMessage);
}


export function getLoginErrorMessage(error: unknown): string {
  
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (!axiosError.response) {
      return ErrorMessages.NETWORK_ERROR;
    }

    const { status, data } = axiosError.response;

  
    switch (status) {
      case 400:
  
        if (data?.non_field_errors?.includes('Invalid credentials')) {
          return ErrorMessages.INVALID_CREDENTIALS;
        }
        
        if (data?.non_field_errors?.includes('Account locked')) {
          return ErrorMessages.ACCOUNT_LOCKED;
        }
        

        if (data && typeof data === 'object') {
          const firstErrorKey = Object.keys(data)[0];
          if (firstErrorKey && Array.isArray(data[firstErrorKey]) && data[firstErrorKey].length > 0) {
            return data[firstErrorKey][0];
          }
        }
        
        return ErrorMessages.UNKNOWN_ERROR;
        
      case 401:
        return ErrorMessages.INVALID_CREDENTIALS;
        
      case 403:
        return data?.detail || ErrorMessages.SESSION_EXPIRED;
        
      case 429:
        return 'Too many login attempts. Please try again later.';
        
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorMessages.SERVER_ERROR;
        
      default:
        return ErrorMessages.UNKNOWN_ERROR;
    }
  }
  

  if (error instanceof Error) {
    return error.message || ErrorMessages.UNKNOWN_ERROR;
  }
  
  return ErrorMessages.UNKNOWN_ERROR;
}

export function validateLoginFormWithToast(email: string, password: string): boolean {
  if (!email || !password) {
    showErrorToast(ErrorMessages.EMPTY_FIELDS);
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showErrorToast(ErrorMessages.INVALID_EMAIL);
    return false;
  }
  
  return true;
}
