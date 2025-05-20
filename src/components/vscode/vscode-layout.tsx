import { useState } from "react"
import { VSCodeHeader } from "./vscode-header"

interface VSCodeLayoutProps {
  tenantName: string
  children: React.ReactNode
}

export function VSCodeLayout({ tenantName, children }: VSCodeLayoutProps) {
  const [isPreview, setIsPreview] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <VSCodeHeader tenantName={tenantName} onPreviewToggle={setIsPreview} />
      <div className="flex flex-1 overflow-hidden">
        {!isPreview && (
          <div className="w-64 border-r border-gray-800 bg-gray-900">
            {/* File explorer component will go here */}
          </div>
        )}
        <div className={`flex-1 ${isPreview ? 'w-full' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  )
} 