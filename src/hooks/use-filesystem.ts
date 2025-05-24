"use client"

import { FileSystemNode } from "@/lib/types/files"
import { useState, useEffect, useCallback } from "react"
import { filesAPI } from "@/lib/api/api"

interface FileItem {
  path: string
  type: 'file' | 'folder'
}

interface APIResponse {
  files: FileItem[]
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
        const rawResponse = await filesAPI.getStoreFiles(tenantName)
        console.log('API Response:', rawResponse)
        
        // Ensure we have an array of file items
        if (!rawResponse || !rawResponse.files || !Array.isArray(rawResponse.files)) {
          throw new Error('Invalid API response format')
        }

        // Convert the response to the expected type
        const typedResponse: APIResponse = {
          files: rawResponse.files.map(file => {
            if (typeof file === 'string') {
              return { path: file, type: 'file' as const }
            }
            return file as FileItem
          })
        }
        
        // Transform file list into nested structure
        const transformedFiles = transformFileStructure(typedResponse.files)
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

  // Helper function to transform flat file list into tree structure
  const transformFileStructure = (filesList: FileItem[]): FileSystemNode[] => {
    console.log('Transforming files:', filesList)
    const root: FileSystemNode[] = []
    const idCounter = { value: 0 }
    const paths: Record<string, FileSystemNode> = {}

    // First pass: create all nodes
    filesList.forEach((item) => {
      if (!item || typeof item.path !== 'string') {
        console.error('Invalid file item:', item)
        return
      }
      
      const pathParts = item.path.split("/")

      if (pathParts.length === 1) {
        // Root level items
        const id = `node-${idCounter.value++}`
        const node: FileSystemNode = {
          id,
          name: pathParts[0],
          path: item.path,
          type: item.type,
          children: item.type === 'folder' ? [] : undefined,
        }

        paths[item.path] = node
        root.push(node)
      } else {
        // Nested items
        const parentPath = pathParts.slice(0, -1).join("/")
        const fileName = pathParts[pathParts.length - 1]

        // Ensure parent directories exist
        let currentPath = ""
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i]
          const prevPath = currentPath
          currentPath = prevPath ? `${prevPath}/${part}` : part

          if (!paths[currentPath]) {
            const id = `node-${idCounter.value++}`
            const node: FileSystemNode = {
              id,
              name: part,
              path: currentPath,
              type: "folder",
              children: [],
            }

            paths[currentPath] = node

            if (prevPath) {
              paths[prevPath].children?.push(node)
            } else {
              root.push(node)
            }
          }
        }

        // Add the file
        const id = `node-${idCounter.value++}`
        const node: FileSystemNode = {
          id,
          name: fileName,
          path: item.path,
          type: item.type,
          children: item.type === 'folder' ? [] : undefined,
        }

        paths[item.path] = node

        if (parentPath && paths[parentPath]) {
          paths[parentPath].children?.push(node)
        }
      }
    })

    // Initial sort: directories first, then files alphabetically
    const sortNodes = (nodes: FileSystemNode[]): FileSystemNode[] => {
      return nodes
        .sort((a, b) => {
          if (a.type === "folder" && b.type !== "folder") return -1
          if (a.type !== "folder" && b.type === "folder") return 1
          return a.name.localeCompare(b.name)
        })
        .map((node) => {
          if (node.children) {
            node.children = sortNodes(node.children)
          }
          return node
        })
    }

    return sortNodes(root)
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

      // Update file content on server
      const response = await filesAPI.updateFileContent(tenantName, path, content)
      
      if (!response || !response.content) {
        throw new Error('Failed to update file content')
      }

      // Update original content after successful save
      setOriginalContent((prev) => ({ ...prev, [path]: response.content }))
      setModifiedFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(path)
        return newSet
      })

      return response.content
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
