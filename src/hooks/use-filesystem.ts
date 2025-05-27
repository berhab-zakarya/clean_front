"use client"

import { FileSystemNode, FileTreeResponse } from "@/lib/types/files"
import { useState, useEffect, useCallback } from "react"
import { filesAPI } from "@/lib/api/api"

type FileTreeNode = {
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

export function useFilesystem(tenantName: string) {
  const [files, setFiles] = useState<FileSystemNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileCache, setFileCache] = useState<Record<string, string>>({})
  const [originalContent, setOriginalContent] = useState<Record<string, string>>({})
  const [modifiedFiles, setModifiedFiles] = useState<Set<string>>(new Set())

  // Fetch files using store subdomain
  useEffect(() => {
    const fetchFiles = async () => {
      if (!tenantName) {
        setError('No store selected')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await filesAPI.getStoreFiles(tenantName)
        console.log('API Response:', response)
        
        // Ensure we have a valid tree response
        if (!response || !response.tree) {
          throw new Error('Invalid API response format')
        }

        // Transform the tree structure into our FileSystemNode format
        const transformedFiles = transformTreeToNodes(response.tree)
        setFiles(transformedFiles)
        setError(null)
      } catch (error: unknown) {
        console.error("Error fetching files:", error)
        setError(`Failed to fetch files: ${error instanceof Error ? error.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [tenantName])

  // Helper function to transform tree structure into FileSystemNode array
  const transformTreeToNodes = (tree: FileTreeResponse['tree']): FileSystemNode[] => {
    const idCounter = { value: 0 }
    
    const createNode = (item: FileTreeNode): FileSystemNode => {
      const id = `node-${idCounter.value++}`
      return {
        id,
        name: item.path.split('/').pop() || '',
        path: item.path,
        type: item.type === 'directory' ? 'folder' : 'file',
        children: item.children ? item.children.map(createNode) : undefined
      }
    }

    // Start with the root node's children
    return tree.children ? tree.children.map(createNode) : []
  }

  // Fetch file content
  const fetchFileContent = useCallback(
    async (path: string) => {
      if (!tenantName) {
        setError('No store selected')
        return null
      }

      try {
        setLoading(true)
        setError(null)

        // Check if we have the content cached
        if (fileCache[path]) {
          setFileContent(fileCache[path])
          return fileCache[path]
        }

        // Fetch file content from API
        const response = await filesAPI.getFileContent(tenantName, path)
        
        if (!response || !response.content) {
          throw new Error('Failed to fetch file content')
        }

        // Update state and cache
        setFileContent(response.content)
        setFileCache((prev) => ({ ...prev, [path]: response.content }))
        setOriginalContent((prev) => ({ ...prev, [path]: response.content }))
        setModifiedFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(path)
          return newSet
        })
        return response.content
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file content'
        setError(errorMessage)
        console.error('Error fetching file content:', error)
        return null
      } finally {
        setLoading(false)
      }
    },
    [fileCache, tenantName]
  )

  function sanitizeCodeBlock(code: string): string {
    return code
      .trim()
      .replace(/^```tsx?\s*/i, '') // Remove starting ```tsx or ```ts
      .replace(/```$/, '')         // Remove trailing ```
      .trim();
  }

  // Update file content (in cache and eventually on server)
  const updateFileContent = useCallback(async (path: string, content: string) => {
    if (!tenantName) {
      setError('No store selected')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      // Update cache
      setFileCache((prev) => ({ ...prev, [path]: content }))
      setFileContent(content)

      // Check if content has been modified
      const original = originalContent[path]
      if (original !== content) {
        setModifiedFiles((prev) => new Set(prev).add(path))
      } else {
        setModifiedFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(path)
          return newSet
        })
      }

      const cleanedContent = sanitizeCodeBlock(content);

      // Update file content on server
      const response = await filesAPI.updateFileContent(tenantName, path, cleanedContent)
      console.log('Update response:', response)

      // Update original content after successful save
      setOriginalContent((prev) => ({ ...prev, [path]: cleanedContent }))
      setModifiedFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(path)
        return newSet
      })

      return cleanedContent;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update file content'
      setError(errorMessage)
      console.error('Error updating file content:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [tenantName, originalContent])

  // Check if a file has been modified
  const isFileModified = useCallback((path: string) => {
    return modifiedFiles.has(path)
  }, [modifiedFiles])

  return {
    files,
    loading,
    error,
    fileContent,
    fetchFileContent,
    updateFileContent,
    isFileModified
  }
}