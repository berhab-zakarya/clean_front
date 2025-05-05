// hooks/useAuth.tsx
import { useContext } from 'react';
import { AuthContext } from '../lib/auth/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { state, login, logout, resetError , signup } = context;
  

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    signup,
    resetError,
  };
};

export default useAuth;