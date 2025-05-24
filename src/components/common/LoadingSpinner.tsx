import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
        />
        {/* Inner spinning ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
        />
        {/* Center dot */}
        <div
          className={`${sizeClasses[size]} absolute top-0 left-0 flex items-center justify-center`}
        >
          <div className="w-1 h-1 bg-indigo-500 rounded-full" />
        </div>
      </div>
      {text && (
        <p
          className={`mt-4 text-gray-500 font-medium ${textSizeClasses[size]} animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      {spinnerContent}
    </div>
  );
}; 