import { Code, Github, Settings, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface VSCodeHeaderProps {
  tenantName: string
  onPreviewToggle?: (isPreview: boolean) => void
}

export function VSCodeHeader({ tenantName, onPreviewToggle }: VSCodeHeaderProps) {
  const [isPreview, setIsPreview] = useState(false)

  const handlePreviewClick = () => {
    const newPreviewState = !isPreview
    setIsPreview(newPreviewState)
    onPreviewToggle?.(newPreviewState)
  }

  return (
    <div className="flex items-center px-4 py-2.5 bg-gray-950 border-b border-gray-800 shadow-sm">
      <div className="flex items-center space-x-3">
        <Code size={20} className="text-blue-400" />
        <div className="text-sm font-medium text-gray-200">VS Code Explorer - {tenantName}</div>
      </div>
      <div className="flex ml-auto space-x-4">
        <button 
          onClick={handlePreviewClick}
          className="flex items-center px-2 py-1 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isPreview ? (
            <>
              <EyeOff size={16} className="mr-1" />
              Exit Preview
            </>
          ) : (
            <>
              <Eye size={16} className="mr-1" />
              Preview
            </>
          )}
        </button>
        <button 
          aria-label="GitHub" 
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Github size={18} />
        </button>
        <button 
          aria-label="Settings" 
          className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  )
}
