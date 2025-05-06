import { 
  Dialog, 
  DialogContent, 
  DialogOverlay,
  DialogTitle 
} from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

interface UpdateProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function UpdateProfileDialog({ isOpen, onClose, onComplete }: UpdateProfileDialogProps) {
  const { updateProfile, isUpdating, userData } = useUser();
  const [formData, setFormData] = useState({
    business_name: "",
    business_address: "",
    phone_number: "",
    tax_identification: "",
    bio: "",
  });

  useEffect(() => {
    if (userData?.user?.profile) {
      const { profile } = userData.user;
      setFormData({
        business_name: profile.business_name || '',
        business_address: profile.business_address || '',
        phone_number: profile.phone_number || '',
        tax_identification: profile.tax_identification || '',
        bio: profile.bio || ''
      });
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
        onClose();
        if (onComplete) {
          onComplete();
        }
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
    <Dialog open={isOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
          <DialogTitle className="text-2xl font-semibold mb-6">
            Complete Your Profile
          </DialogTitle>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Business Name</label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Business Address</label>
              <input
                type="text"
                name="business_address"
                value={formData.business_address}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax ID</label>
              <input
                type="text"
                name="tax_identification"
                value={formData.tax_identification}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 bg-[var(--primary-900)] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}