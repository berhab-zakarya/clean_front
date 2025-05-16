"use client"

import { useState } from "react"
import { VSCodeHeader } from "@/components/vscode/vscode-header"
import { VSCodeSidebar } from "@/components/vscode/vscode-sidebar"
import { VSCodeFileExplorer } from "@/components/vscode/vscode-file-explorer"
import { VSCodeEditor } from "@/components/vscode/vscode-editor"
import { VSCodeStatusBar } from "@/components/vscode/vscode-status-bar"
import { ErrorBoundary } from "@/components/vscode/error-boundary"
import { useFilesystem } from "@/hooks/use-filesystem"

export interface VSCodeExplorerProps {
  tenantName: string
}

export function VSCodeExplorer({ tenantName }: VSCodeExplorerProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null)
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null)

  const { files, loading, error, fileContent, fetchFileContent, updateFileContent } = useFilesystem(tenantName)

  const handleFileSelect = async (id: string, path: string) => {
    setActiveFileId(id)
    setActiveFilePath(path)
    console.log("Selected file:", id, path)
    await fetchFileContent(path)
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

        <div className="flex-1 flex flex-col overflow-hidden">
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

          <VSCodeStatusBar filePath={activeFilePath} fileType={activeFilePath?.split(".").pop() || "txt"} />
        </div>
      </div>
    </div>
  )
}
