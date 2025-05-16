import { File, Search, Github } from "lucide-react"

export function VSCodeSidebar() {
  return (
    <div className="flex flex-col w-12 bg-gray-950 border-r border-gray-800">
      <div className="flex flex-col items-center py-4 space-y-6">
        <button
          className="p-2 rounded hover:bg-gray-800 text-blue-400 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Files"
        >
          <File size={24} />
        </button>
        <button
          className="p-2 rounded hover:bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search"
        >
          {/* <Search size={24} /> */}
        </button>
        <button
          className="p-2 rounded hover:bg-gray-800 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="GitHub"
        >
          {/* <Github size={24} /> */}
        </button>
      </div>
    </div>
  )
}
