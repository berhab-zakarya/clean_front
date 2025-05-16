import { useState, useEffect } from "react";
import { Building2, MapPin, Phone, Receipt, User, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-toastify";
import { isProfileComplete } from "@/utils/profile-validator";
import { useRouter } from "next/navigation";

interface CompleteProfileProps {
  onComplete: () => void;
}


export const CompleteProfile = ({ onComplete }: CompleteProfileProps) => {
  const { updateProfile, isUpdating, userData } = useUser();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    business_name: "",
    business_address: "",
    phone_number: "",
    tax_identification: "",
    bio: "",
  });
  const router = useRouter(); 

  // Check profile completion status whenever form data changes
  useEffect(() => {
    setIsComplete(isProfileComplete(formData));
  }, [formData]);

  useEffect(() => {
    if (userData?.user?.profile) {
      const { profile } = userData.user;
      const profileData = {
        business_name: profile.business_name || '',
        business_address: profile.business_address || '',
        phone_number: profile.phone_number || '',
        tax_identification: profile.tax_identification || '',
        bio: profile.bio || ''
      };
      setFormData(profileData);
      setIsComplete(isProfileComplete(profileData));
    }
  }, [userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await updateProfile({
        profile: {
          ...formData,
          is_verified: userData?.user?.profile?.is_verified || false,
          verification_document_url: userData?.user?.profile?.verification_document_url,
          profile_image_url: userData?.user?.profile?.profile_image_url
        }
      });

      if (success) {
        toast.success('Profile updated successfully');
        setIsComplete(isProfileComplete(formData));
        router.push('/dashboard/StoreSetupGuide');
       onComplete();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header with completion status */}
          <div className="bg-gradient-to-r from-[var(--primary-900)] to-[var(--primary-800)] px-8 py-12">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-white">Business Profile</h1>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                {isComplete ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Profile Complete</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">Profile Incomplete</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-[var(--primary-100)]">Complete your business information to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Business Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Business Name
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-200)] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Business Address */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Business Address
                </label>
                <input
                  type="text"
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-200)] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-200)] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Tax ID */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Receipt className="w-4 h-4 text-gray-400" />
                  Tax ID
                </label>
                <input
                  type="text"
                  name="tax_identification"
                  value={formData.tax_identification}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-200)] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Bio */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-200)] focus:border-transparent transition-all min-h-[120px]"
                  rows={4}
                />
              </div>
            </div>

            {/* Updated Submit Button with completion status */}
            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[var(--primary-900)] to-[var(--primary-800)] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                     Completing...
                  </>
                ) : (
                  'Complete Profile'
                )}
              </button>
              {!isComplete && (
                <span className="text-sm text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Please fill in all required fields
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add this type to help with type checking
export type ProfileCompletionStatus = {
  isComplete: boolean;
  profile: typeof formData;
};