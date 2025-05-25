export const DashboardLoadingUI = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-blue-100/40 rounded-full blur-3xl animate-pulse" 
               style={{ animationDelay: '2s', animationDuration: '4s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-100/30 to-blue-100/30 rounded-full blur-3xl animate-ping" 
               style={{ animationDuration: '6s' }} />
        </div>
  
        {/* Main loading content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Logo/Brand area */}
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-8 h-8 bg-white rounded-lg opacity-90" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg mx-auto animate-pulse" />
              <div className="h-4 w-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg mx-auto animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
  
          {/* Enhanced spinner */}
          <div className="relative">
            {/* Outer pulsing ring */}
            <div className="w-20 h-20 border-4 border-blue-100/50 rounded-full animate-ping absolute" 
                 style={{ animationDuration: '3s' }} />
            
            {/* Main spinning ring */}
            <div className="w-16 h-16 border-4 border-transparent border-t-blue-500 border-r-indigo-500 rounded-full animate-spin mx-auto" />
            
            {/* Inner counter-rotating ring */}
            <div className="w-12 h-12 border-3 border-transparent border-b-blue-400 border-l-indigo-400 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2" 
                 style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            
            {/* Center dot */}
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse shadow-lg" />
          </div>
  
          {/* Loading text with animated dots */}
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-lg font-semibold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                Loading Dashboard
              </span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
            <p className="text-sm text-slate-500 animate-pulse">
              Setting up your workspace...
            </p>
          </div>
  
          {/* Progress indicator */}
          <div className="w-64 mx-auto space-y-2">
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" 
                   style={{ width: '60%', animationDuration: '2s' }} />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Initializing...</span>
              <span>60%</span>
            </div>
          </div>
  
          {/* Skeleton cards preview */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3 animate-pulse border border-slate-200/50 shadow-sm" 
                   style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-2 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
  
          {/* Floating elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-2 h-2 bg-blue-400 rounded-full absolute animate-float" 
                 style={{ top: '20%', left: '10%', animationDelay: '0s', animationDuration: '3s' }} />
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full absolute animate-float" 
                 style={{ top: '60%', right: '15%', animationDelay: '1s', animationDuration: '4s' }} />
            <div className="w-2.5 h-2.5 bg-slate-300 rounded-full absolute animate-float" 
                 style={{ bottom: '30%', left: '80%', animationDelay: '2s', animationDuration: '3.5s' }} />
          </div>
        </div>
  
        {/* Custom animations styles */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };