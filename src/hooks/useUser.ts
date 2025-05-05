import { useState, useEffect } from 'react';
import api, { authAPI, UpdateProfileData, UserProfileResponse } from '@/lib/api/api';
import { useAuth } from './useAuth';

export const useUser = () => {
  const [userData, setUserData] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get<UserProfileResponse>('/profile/');
      setUserData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setIsUpdating(true);
      const response = await authAPI.updateProfile(data);
      setUserData(response);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  return {
    userData,
    loading,
    error,
    isUpdating,
    updateProfile,
    refetch: fetchUserProfile
  };
};