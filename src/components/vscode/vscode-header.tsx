import { Code, Github, Settings} from "lucide-react"

interface VSCodeHeaderProps {
  tenantName: string
  onPreviewToggle?: (isPreview: boolean) => void
}

export function VSCodeHeader({ tenantName }: VSCodeHeaderProps) {
  



  return (
    <div className="relative flex items-center px-6 py-3 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-700/50 shadow-xl backdrop-blur-sm">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none"></div>
      
      {/* Left section with enhanced styling */}
      <div className="flex items-center space-x-4 relative z-10">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
          <Code size={22} className="text-white" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-white tracking-wide">Algecom Explorer</div>
          <div className="text-xs text-blue-300 font-medium">{tenantName}</div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center ml-6 space-x-2 relative z-10">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
        <span className="text-xs text-green-300 font-medium">Connected</span>
      </div>

      {/* Right section with enhanced buttons */}
      <div className="flex ml-auto space-x-2 relative z-10">
        <button 
          aria-label="GitHub" 
          className="group relative p-2.5 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:shadow-lg hover:shadow-gray-900/30 border border-gray-700/30 hover:border-gray-600/50"
        >
          <Github size={18} className="transition-transform duration-200 group-hover:scale-110" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        <button 
          aria-label="Settings" 
          className="group relative p-2.5 text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/70 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:shadow-lg hover:shadow-gray-900/30 border border-gray-700/30 hover:border-gray-600/50"
        >
          <Settings size={18} className="transition-transform duration-200 group-hover:rotate-90" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        
      </div>

      {/* Subtle animated border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
    </div>
  )
}


