import { useState } from 'react';
import SimpleButton from "@/components/common/SimpleButton";

interface StoreNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function StoreNameDialog({ isOpen, onClose, onSubmit }: StoreNameDialogProps) {
  const [storeName, setStoreName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(storeName);
    setStoreName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" />
      
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
          <h2 className="text-[20px] font-[600] mb-4">Choose your store name</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter store name"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-900)]"
              required
            />
            <div className="flex justify-end gap-3">
              <SimpleButton
                title="Cancel"
                onClick={onClose}
                className="bg-gray-100 text-gray-700 hover:bg-black"
              />
              <SimpleButton
                title="Save"
                type="submit"
               className="bg-[var(--primary-900)] text-white hover:bg-white hover:text-[var(--primary-900)] transition-colors"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}