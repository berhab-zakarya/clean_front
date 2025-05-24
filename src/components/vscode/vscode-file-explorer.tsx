"use client"

import { useState, useCallback } from "react"
import { File, Folder, Tree } from "@/components/magicui/file-tree"
import { Loader2 } from "lucide-react"
import { FileSystemNode } from "@/lib/types/files"
import { TreeViewElement } from "@/components/magicui/file-tree"

interface VSCodeFileExplorerProps {
  files: FileSystemNode[]
  loading: boolean
  error: string | null
  activeFileId: string | null
  onFileSelect: (id: string, path: string) => void
}

export function VSCodeFileExplorer({ files, loading, error, activeFileId, onFileSelect }: VSCodeFileExplorerProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Handle clicking on items in the file tree
  const handleItemClick = useCallback(
    (id: string, node: FileSystemNode) => {
      if (node.type === "file") {
        // When a file is clicked, call the parent's onFileSelect with id and path
        onFileSelect(id, node.path)
      } else {
        // For folders, just toggle the expanded state
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
      }
    },
    [onFileSelect],
  )

  // Transform our file structure to match the Tree component's expected format
  const transformToTreeElements = useCallback((nodes: FileSystemNode[]): TreeViewElement[] => {
    return nodes.map((node) => ({
      id: node.id,
      name: node.name,
      isSelectable: true,
      children: node.children ? transformToTreeElements(node.children) : undefined,
    }))
  }, [])

  // Recursively render folders and files
  const renderFileTree = useCallback(
    (nodes: FileSystemNode[]) => {
      return nodes.map((node) => {
        if (node.type === "folder") {
          return (
            <Folder 
              key={node.id} 
              value={node.id} 
              element={node.name}
              className="text-white text-[18px]"
            >
              {node.children && renderFileTree(node.children)}
            </Folder>
          )
        } else {
          return (
            <File onClick={() => handleItemClick(node.id, node)} key={node.id} value={node.id} className={activeFileId === node.id ? "bg-[#1E3A8A] p-1 font-[400] text-white text-[16px]" : "text-white text-[16px]"}>
              <p>{node.name}</p>
            </File>
          )
        }
      })
    },
    [activeFileId, expandedItems],
  )

  // Helper function to find a node by ID
  const findNodeById = useCallback(
    (selectedId: string, nodes: FileSystemNode[]): FileSystemNode | null => {
      for (const node of nodes) {
        if (node.id === selectedId) return node
        if (node.children) {
          const found = findNodeById(selectedId, node.children)
          if (found) return found
        }
      }
      return null
    },
    [],
  )

  // Handle selection change from the Tree component
  const handleSelectChange = useCallback(
    (selectedId: string) => {
      const node = findNodeById(selectedId, files)
      
      // Only trigger onFileSelect for file nodes, not folders
      if (node && node.type === "file") {
        onFileSelect(selectedId, node.path)
      }
    },
    [files, onFileSelect, findNodeById],
  )

  return (
    <div className="w-64 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-gray-700/50 overflow-y-auto">
      <div className="p-2 font-medium text-sm uppercase tracking-wider text-gray-500">Explorer</div>

      {loading ? (
        <div className="flex items-center justify-center p-4 text-gray-400">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Loading files...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-red-400 bg-red-900/20 m-2 rounded-md">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
          <button
            className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : files && files.length > 0 ? (
        <div className="p-2">
          <Tree
            className="overflow-hidden rounded-md bg-gray-900 p-2"
            initialSelectedId={activeFileId || undefined}
            initialExpandedItems={expandedItems}
            elements={transformToTreeElements(files)}
            // Pass onSelect to handle selection changes from Tree component
            onSelect={()=>handleSelectChange}
          >
            {renderFileTree(files)}
          </Tree>
        </div>
      ) : (
        <div className="p-4 text-gray-400">No files found</div>
      )}
    </div>
  )
}