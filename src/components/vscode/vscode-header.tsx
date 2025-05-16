import { Code, Github, Settings } from "lucide-react"

interface VSCodeHeaderProps {
  tenantName: string
}

export function VSCodeHeader({ tenantName }: VSCodeHeaderProps) {
  return (
    <div className="flex items-center px-4 py-2 bg-gray-950 border-b border-gray-800">
      <div className="flex items-center space-x-3">
        <Code size={20} className="text-blue-400" />
        <div className="text-sm font-medium">VS Code Explorer - {tenantName}</div>
      </div>
      <div className="flex ml-auto space-x-3">
        <button aria-label="GitHub" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          <Github size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
        </button>
        <button aria-label="Settings" className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
          <Settings size={18} className="text-gray-400 hover:text-gray-200 cursor-pointer" />
        </button>
      </div>
    </div>
  )
}
