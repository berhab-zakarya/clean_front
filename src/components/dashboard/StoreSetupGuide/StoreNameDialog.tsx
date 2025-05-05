import { useState } from 'react';
import SimpleButton from "@/components/common/SimpleButton";
import { useStore } from '@/hooks/useStore';
import { Alert } from '@/components/common/Alert';

interface StoreNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (store: any) => void;
}

export function StoreNameDialog({ isOpen, onClose, onSuccess }: StoreNameDialogProps) {
  const { createStore, loading, error } = useStore();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    storeName: '',
    subdomain: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const storeData = {
      store_name: formData.storeName,
      subdomain: formData.subdomain,
      store_type: 'pure'
    };

    const store = await createStore(storeData);
    
    if (store) {
      setShowSuccess(true);
      setFormData({ storeName: '', subdomain: '' });
      if (onSuccess) {
        onSuccess(store);
      }
      // Auto close after success
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-[20px] font-[600] mb-4">Set up your store</h2>
          
          {/* Alerts */}
          {error && (
            <Alert 
              type="error"
              message={error}
              className="mb-4"
              onClose={() => setShowSuccess(false)}
            />
          )}
          
          {showSuccess && (
            <Alert 
              type="success"
              message="Store created successfully!"
              className="mb-4"
              onClose={() => setShowSuccess(false)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name Input */}
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store name
              </label>
              <input
                id="storeName"
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                placeholder="Enter store name"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-900)]"
                required
                disabled={loading}
              />
            </div>

            {/* Subdomain Input */}
            <div>
              <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                Store subdomain
              </label>
              <div className="flex items-center">
                <input
                  id="subdomain"
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="your-store"
                  className="w-full p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-900)]"
                  required
                  disabled={loading}
                />
                <span className="bg-gray-50 text-gray-500 p-2 border border-l-0 border-gray-300 rounded-r-md">
                  .mystore.com
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <SimpleButton
                title="Cancel"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              />
              <SimpleButton
                title={loading ? "Creating..." : "Save"}
                type="submit"
                disabled={loading}
                className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] transition-colors"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}