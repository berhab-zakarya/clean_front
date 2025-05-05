import { FC } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  className?: string;
  onClose?: () => void;
}

const alertStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};

export const Alert: FC<AlertProps> = ({ type, message, className = '', onClose }) => {
  return (
    <div className={`p-4 rounded-md border ${alertStyles[type]} ${className}`}>
      <div className="flex items-center justify-between">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};