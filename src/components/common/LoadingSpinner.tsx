import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  variant?: 'primary' | 'secondary' | 'gradient';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  variant = 'gradient',
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return {
          outerRing: 'border-[#7C5CFC]/20',
          innerRing: 'border-[#1D1178]',
          centerDot: 'bg-[#1D1178]',
          pulseRing: 'border-[#432EB5]/30',
        };
      case 'secondary':
        return {
          outerRing: 'border-[#FFFFFF]/20',
          innerRing: 'border-[#9F84FD]',
          centerDot: 'bg-[#9F84FD]',
          pulseRing: 'border-[#CEBEFE]/30',
        };
      case 'gradient':
      default:
        return {
          outerRing: 'border-[#E7DEFE]/30',
          innerRing: 'border-transparent bg-gradient-to-tr from-[#1D1178] via-[#432EB5] to-[#9F84FD]',
          centerDot: 'bg-gradient-to-br from-[#B49DFE] to-[#1D1178]',
          pulseRing: 'border-[#5E43D8]/20',
        };
    }
  };

  const variantClasses = getVariantClasses();

  const spinnerContent = (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Pulse effect background */}
        <div
          className={`${sizeClasses[size]} border-4 ${variantClasses.pulseRing} rounded-full animate-ping absolute opacity-20`}
          style={{ animationDuration: '2s' }}
        />
        
        {/* Outer decorative ring */}
        <div
          className={`${sizeClasses[size]} border-4 ${variantClasses.outerRing} rounded-full`}
        />
        
        {/* Main spinning ring */}
        <div
          className={`${sizeClasses[size]} border-4 ${variantClasses.innerRing} ${
            variant === 'gradient' ? 'border-t-transparent rounded-full' : 'border-t-transparent rounded-full'
          } animate-spin absolute top-0 left-0`}
          style={{ animationDuration: '1s' }}
        />
        
        {/* Secondary counter-rotating ring */}
        <div
          className={`${sizeClasses[size]} border-2 border-transparent border-r-[#B49DFE] border-b-[#CEBEFE] rounded-full animate-spin absolute top-1 left-1`}
          style={{ 
            animationDuration: '1.5s',
            animationDirection: 'reverse',
            width: `calc(100% - 8px)`,
            height: `calc(100% - 8px)`
          }}
        />
        
        {/* Center pulsing dot */}
        <div
          className={`${sizeClasses[size]} absolute top-0 left-0 flex items-center justify-center`}
        >
          <div 
            className={`${dotSizeClasses[size]} ${variantClasses.centerDot} rounded-full animate-pulse shadow-lg`}
            style={{ animationDuration: '2s' }}
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute w-1 h-1 bg-[#9F84FD] rounded-full animate-bounce opacity-60"
            style={{ 
              top: '10%', 
              left: '20%',
              animationDelay: '0s',
              animationDuration: '3s'
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-[#CEBEFE] rounded-full animate-bounce opacity-60"
            style={{ 
              top: '80%', 
              right: '15%',
              animationDelay: '1s',
              animationDuration: '2.5s'
            }}
          />
          <div 
            className="absolute w-1 h-1 bg-[#B49DFE] rounded-full animate-bounce opacity-60"
            style={{ 
              bottom: '15%', 
              left: '70%',
              animationDelay: '1.5s',
              animationDuration: '2s'
            }}
          />
        </div>
      </div>
      
      {text && (
        <div className="text-center space-y-2">
          <p
            className={`font-semibold bg-gradient-to-r from-[#1D1178] via-[#432EB5] to-[#5E43D8] bg-clip-text text-transparent ${textSizeClasses[size]}`}
          >
            {text}
          </p>
          <div className="flex space-x-1 justify-center">
            <div 
              className="w-2 h-2 bg-[#1D1178] rounded-full animate-bounce"
              style={{ animationDelay: '0s' }}
            />
            <div 
              className="w-2 h-2 bg-[#432EB5] rounded-full animate-bounce"
              style={{ animationDelay: '0.2s' }}
            />
            <div 
              className="w-2 h-2 bg-[#5E43D8] rounded-full animate-bounce"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1D1178]/80 via-[#2D1D92]/70 to-[#432EB5]/60 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#E7DEFE]/50">
          {spinnerContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 bg-gradient-to-br from-[#FFFFFF] to-[#E7DEFE]/30 rounded-2xl border border-[#CEBEFE]/30 shadow-lg">
      {spinnerContent}
    </div>
  );
};

