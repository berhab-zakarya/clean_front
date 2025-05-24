import { File, Search, Github } from "lucide-react"

export function VSCodeSidebar() {
  return (
    <div className="relative flex flex-col w-16 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-gray-700/50 shadow-2xl">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      
      {/* Active indicator bar */}
      <div className="absolute left-0 top-6 w-1 h-12 bg-gradient-to-b from-blue-400 to-blue-500 rounded-r-full shadow-lg shadow-blue-500/30"></div>
      
      <div className="flex flex-col items-center py-6 space-y-8 relative z-10">
        <button
          className="group relative p-3 rounded-xl text-blue-400 bg-gradient-to-br from-blue-900/40 to-blue-800/30 border border-blue-700/40 hover:from-blue-800/50 hover:to-blue-700/40 hover:border-blue-600/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:shadow-lg hover:shadow-blue-900/30 hover:scale-105"
          aria-label="Files"
        >
          <File size={24} className="transition-all duration-200 group-hover:scale-110" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
            Files
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/90 border-l border-t border-gray-600/50 rotate-45"></div>
          </div>
        </button>
        
        <button
          className="group relative p-3 rounded-xl text-gray-400 bg-gray-800/30 border border-gray-700/30 hover:text-gray-200 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:shadow-lg hover:shadow-gray-900/30 hover:scale-105"
          aria-label="Search"
        >
          <Search size={24} className="transition-all duration-200 group-hover:scale-110" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
            Search
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/90 border-l border-t border-gray-600/50 rotate-45"></div>
          </div>
        </button>
        
        <button
          className="group relative p-3 rounded-xl text-gray-400 bg-gray-800/30 border border-gray-700/30 hover:text-gray-200 hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 hover:shadow-lg hover:shadow-gray-900/30 hover:scale-105"
          aria-label="GitHub"
        >
          <Github size={24} className="transition-all duration-200 group-hover:scale-110" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-3 py-2 bg-gray-800/90 backdrop-blur-sm border border-gray-600/50 rounded-lg text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
            GitHub
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800/90 border-l border-t border-gray-600/50 rotate-45"></div>
          </div>
        </button>
      </div>
      
      {/* Bottom section for additional visual balance */}
      <div className="mt-auto mb-6 flex justify-center">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
      </div>
    </div>
  )
}


