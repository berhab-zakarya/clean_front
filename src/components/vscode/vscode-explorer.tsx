"use client"
import { useState, useEffect } from "react"
import { VSCodeHeader } from "@/components/vscode/vscode-header"
import { VSCodeSidebar } from "@/components/vscode/vscode-sidebar"
import { VSCodeFileExplorer } from "@/components/vscode/vscode-file-explorer"
import { VSCodeEditor } from "@/components/vscode/vscode-editor"
import { VSCodeStatusBar } from "@/components/vscode/vscode-status-bar"
import { ErrorBoundary } from "@/components/vscode/error-boundary"
import { useFilesystem } from "@/hooks/use-filesystem"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Play, RefreshCw, MonitorSmartphone, Tablet, Smartphone, Maximize2, ExternalLink } from "lucide-react"

export interface VSCodeExplorerProps {
  tenantName: string
}

export function VSCodeExplorer({ tenantName }: VSCodeExplorerProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState(`http://${tenantName}.lvh.me:3002`)
  const [previewSize, setPreviewSize] = useState("desktop")
  const [activeTab, setActiveTab] = useState("editor")
  const [refreshKey, setRefreshKey] = useState(0)

  const { files, loading, error, fileContent, fetchFileContent, updateFileContent } = useFilesystem(tenantName)

  const handleFileSelect = async (id: string, path: string) => {
    setActiveFileId(id)
    setActiveFilePath(path)
    console.log("Selected file:", id, path)
    await fetchFileContent(path)
  }

  const handleRefreshPreview = () => {
    setRefreshKey(prev => prev + 1)
  }

  // Determine preview width based on selected device
  const getPreviewWidth = () => {
    switch (previewSize) {
      case "mobile":
        return "w-64"
      case "tablet":
        return "w-96"
      case "desktop":
      default:
        return "w-full"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-300 font-mono">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>

      <VSCodeHeader tenantName={tenantName} />

      <div className="flex flex-1 overflow-hidden">
        <VSCodeSidebar />

        <ErrorBoundary fallback={<div className="p-4 text-red-400">Something went wrong with the file explorer</div>}>
          <VSCodeFileExplorer
            files={files}
            loading={loading}
            error={error}
            activeFileId={activeFileId}
            onFileSelect={handleFileSelect}
          />
        </ErrorBoundary>

        <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-800">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex items-center bg-gray-800 px-2 border-b border-gray-700">
              <TabsList className="bg-transparent">
                <TabsTrigger value="editor" className="data-[state=active]:bg-gray-900">Code</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-gray-900">Preview</TabsTrigger>
              </TabsList>
              
              {activeTab === "preview" && (
                <div className="ml-auto flex items-center space-x-2">
                  <div className="flex items-center bg-gray-700 rounded p-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-6 w-6 ${previewSize === 'desktop' ? 'bg-gray-600' : ''}`}
                      onClick={() => setPreviewSize("desktop")}
                    >
                      <MonitorSmartphone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-6 w-6 ${previewSize === 'tablet' ? 'bg-gray-600' : ''}`}
                      onClick={() => setPreviewSize("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-6 w-6 ${previewSize === 'mobile' ? 'bg-gray-600' : ''}`}
                      onClick={() => setPreviewSize("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleRefreshPreview}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => window.open(previewUrl, '_blank')}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <TabsContent value="editor" className="flex-1 p-0 m-0">
              <ErrorBoundary fallback={<div className="p-4 text-red-400">Something went wrong with the editor</div>}>
                <VSCodeEditor
                  activeFilePath={activeFilePath}
                  fileContent={fileContent}
                  onContentChange={(content) => {
                    if (activeFilePath) {
                      updateFileContent(activeFilePath, content)
                    }
                  }}
                />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 p-0 m-0 flex flex-col bg-white">
              <div className="flex-1 flex justify-center overflow-auto p-6 bg-gray-100">
                <div className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${getPreviewWidth()}`}>
                  <div className="h-8 bg-gray-100 flex items-center px-3 border-b">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={previewUrl} 
                        onChange={(e) => setPreviewUrl(e.target.value)}
                        className="bg-gray-200 px-2 py-0.5 text-xs rounded text-gray-800 w-64"
                      />
                      <Button size="sm" variant="ghost" className="h-6 p-1" onClick={handleRefreshPreview}>
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden bg-white" style={{ minHeight: "400px" }}>
                    <iframe 
                      key={refreshKey}
                      src={previewUrl} 
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                      title="Website Preview"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <VSCodeStatusBar filePath={activeFilePath} fileType={activeFilePath?.split(".").pop() || "txt"} />
        </div>
      </div>
    </div>
  )
}