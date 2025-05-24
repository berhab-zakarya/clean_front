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
  const [previewUrl, setPreviewUrl] = useState(`http://${tenantName}.lvh.me:8000`)
  const [previewSize, setPreviewSize] = useState("desktop")
  const [activeTab, setActiveTab] = useState("editor")
  const [refreshKey, setRefreshKey] = useState(0)

  const { files, loading, error, fileContent, fetchFileContent, updateFileContent } = useFilesystem(tenantName)

  const onSave = async ( updatedFileContent ) => {
    if (activeFilePath) { 
      await updateFileContent(activeFilePath, updatedFileContent)
      console.log("File saved:", activeFilePath)
    }
  }
 
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 font-mono relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>

      <VSCodeHeader tenantName={tenantName} />

      <div className="flex flex-1 overflow-hidden relative z-10">
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

        <div className="flex-1 flex flex-col overflow-hidden border-l border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex items-center bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm px-4 py-2 border-b border-gray-700/50 shadow-lg">
              <TabsList className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-1">
                <TabsTrigger 
                  value="editor" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/30 transition-all duration-300 rounded-lg px-4 py-2 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                    <span>Code</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-900/30 transition-all duration-300 rounded-lg px-4 py-2 font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                    <span>Preview</span>
                  </span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === "preview" && (
                <div className="ml-auto flex items-center space-x-3">
                  <div className="flex items-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-1 shadow-lg">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-lg transition-all duration-300 ${previewSize === 'desktop' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30' : 'hover:bg-gray-700/50'}`}
                      onClick={() => setPreviewSize("desktop")}
                    >
                      <MonitorSmartphone className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-lg transition-all duration-300 ${previewSize === 'tablet' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30' : 'hover:bg-gray-700/50'}`}
                      onClick={() => setPreviewSize("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-8 w-8 rounded-lg transition-all duration-300 ${previewSize === 'mobile' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30' : 'hover:bg-gray-700/50'}`}
                      onClick={() => setPreviewSize("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 shadow-lg group" 
                    onClick={handleRefreshPreview}
                  >
                    <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 rounded-lg hover:bg-gray-700/50 hover:border-gray-600/50 transition-all duration-300 shadow-lg group" 
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
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
                  } }                />
              </ErrorBoundary>
            </TabsContent>
            
            <TabsContent value="preview" className="flex-1 p-0 m-0 flex flex-col bg-gradient-to-br from-gray-100 via-white to-gray-50">
              <div className="flex-1 flex justify-center overflow-auto p-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
                <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${getPreviewWidth()} border border-gray-200/50`}>
                  {/* Enhanced browser chrome */}
                  <div className="h-12 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 flex items-center px-4 border-b border-gray-200/50">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm"></div>
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm"></div>
                    </div>
                    <div className="mx-auto flex items-center space-x-3">
                      <div className="relative">
                        <input 
                          type="text" 
                          value={previewUrl} 
                          onChange={(e) => setPreviewUrl(e.target.value)}
                          className="bg-white/80 backdrop-blur-sm border border-gray-300/50 px-4 py-2 text-sm rounded-lg text-gray-700 w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200"
                          placeholder="Enter URL..."
                        />
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 rounded-lg border border-blue-200/50 transition-all duration-200 group" 
                        onClick={handleRefreshPreview}
                      >
                        <Play className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden bg-white relative" style={{ minHeight: "400px" }}>
                    {/* Loading overlay effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
                    <iframe 
                      key={refreshKey}
                      src={previewUrl} 
                      className="w-full h-full border-0 relative z-10"
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

