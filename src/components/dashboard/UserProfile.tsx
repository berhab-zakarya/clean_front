import { useUser } from '@/hooks/useUser';

export const UserProfile = () => {
  const { userData, loading, error } = useUser();

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  const { user } = userData;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-4">
        <div>
          <p className="text-gray-600">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-gray-600">Role</p>
          <p className="font-medium">{user.role_name}</p>
        </div>
        <div>
          <p className="text-gray-600">Business Details</p>
          <div className="ml-4">
            <p>Name: {user.profile.business_name || 'Not set'}</p>
            <p>Address: {user.profile.business_address || 'Not set'}</p>
            <p>Phone: {user.profile.phone_number || 'Not set'}</p>
            <p>Tax ID: {user.profile.tax_identification || 'Not set'}</p>
          </div>
        </div>
        <div>
          <p className="text-gray-600">Account Status</p>
          <div className="ml-4">
            <p>Verified: {user.profile.is_verified ? 'Yes' : 'No'}</p>
            <p>Active: {user.is_active ? 'Yes' : 'No'}</p>
            <p>Member since: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};