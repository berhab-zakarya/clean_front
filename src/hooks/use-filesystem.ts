"use client"

import { FileSystemNode } from "@/lib/types"
import { useState, useEffect, useCallback } from "react"

export function useFilesystem(tenantName: string) {
  const [files, setFiles] = useState<FileSystemNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tenant, setTenant] = useState<any>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [fileCache, setFileCache] = useState<Record<string, string>>({})

  // Get mock data for development

  // Fetch tenant information
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:8000/api/v1/stores/97/`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTY3MjA0LCJpYXQiOjE3NDY4MDcyMDQsImp0aSI6ImM3MDdjMTVhOTk2YTQwM2U5YjJlNmNhYzJjMGVhYzc3IiwidXNlcl9pZCI6N30.PLfysdCGyVd1-SzrOz5w5PWdH9yr_rYDHmM4WCR69FA",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch tenant: ${response.status}`)
        }

        const data = await response.json()
        setTenant(data)
      } catch (err: any) {
        console.error("Error fetching tenant:", err)
        setError(`Failed to fetch tenant: ${err.message}`)
        // Fall back to mock data
        // setFiles(mockFiles)
      } finally {
        setLoading(false)
      }
    }

    if (tenantName) {
      fetchTenant()
    }
  }, [tenantName])

  // Fetch files using tenant
  useEffect(() => {
    const fetchFiles = async () => {
      if (!tenant) return

      try {
        setLoading(true)
        const response = await fetch(`http://127.0.0.1:8000/api/v1/tenants/files/${tenantName}/`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTY3MjA0LCJpYXQiOjE3NDY4MDcyMDQsImp0aSI6ImM3MDdjMTVhOTk2YTQwM2U5YjJlNmNhYzJjMGVhYzc3IiwidXNlcl9pZCI6N30.PLfysdCGyVd1-SzrOz5w5PWdH9yr_rYDHmM4WCR69FA",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.status}`)
        }

        const data = await response.json()

        // Transform flat file list into nested structure
        const transformedFiles = transformFileStructure(data.files)
        setFiles(transformedFiles)
      } catch (err: any) {
        console.error("Error fetching files:", err)
        setError(`Failed to fetch files: ${err.message}`)
        // Fall back to mock data
        // setFiles(mockFiles)
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [tenant, tenantName])

  // Fetch file content
  const fetchFileContent = useCallback(
    async (path: string) => {
      // Check if we have the content cached
      if (fileCache[path]) {
        setFileContent(fileCache[path])
        return fileCache[path]
      }

      // For development, use mock content for specific files
      if (path === "src/components/announcement.tsx") {
        const mockContent = `export default function Announcement() {
  return (
    <div className="w-full h-[122px] bg-[#FB0A0A] flex items-center justify-center text-2xl text-white">
      <h1>NEW MONITORS ARE COMING!</h1>
    </div>
  )
}`
        setFileContent(mockContent)
        setFileCache((prev) => ({ ...prev, [path]: mockContent }))
        return mockContent
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/tenants/files/${tenantName}/?path=${path}`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MTY3MjA0LCJpYXQiOjE3NDY4MDcyMDQsImp0aSI6ImM3MDdjMTVhOTk2YTQwM2U5YjJlNmNhYzJjMGVhYzc3IiwidXNlcl9pZCI6N30.PLfysdCGyVd1-SzrOz5w5PWdH9yr_rYDHmM4WCR69FA",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status}`)
        }

        const data = await response.json()
        setFileContent(data.content)
        setFileCache((prev) => ({ ...prev, [path]: data.content }))
        return data.content
      } catch (err: any) {
        console.error("Error fetching file content:", err)
        const errorMessage = `// Error loading file: ${err.message}`
        setFileContent(errorMessage)
        return errorMessage
      }
    },
    [fileCache, tenantName],
  )

  // Update file content (in cache and eventually on server)
  const updateFileContent = useCallback((path: string, content: string) => {
    setFileContent(content)
    setFileCache((prev) => ({ ...prev, [path]: content }))

    // In a real application, we would send an API request to update the file
    // For example:
    // updateFileOnServer(path, content);
  }, [])

  // Helper function to transform flat file list into tree structure
  const transformFileStructure = (filesList: any[]): FileSystemNode[] => {
    const root: FileSystemNode[] = []
    const idCounter = { value: 0 }
    const paths: Record<string, FileSystemNode> = {}

    // First pass: create all nodes
    filesList.forEach((item) => {
      const pathParts = item.path.split("/")
      const isDirectory = item.type === "directory"

      if (pathParts.length === 1) {
        // Root level items
        const id = `node-${idCounter.value++}`
        const node: FileSystemNode = {
          id,
          name: pathParts[0],
          path: item.path,
          type: isDirectory ? "folder" : "file",
          children: isDirectory ? [] : undefined,
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

        // Add the file/directory
        const id = `node-${idCounter.value++}`
        const node: FileSystemNode = {
          id,
          name: fileName,
          path: item.path,
          type: isDirectory ? "folder" : "file",
          children: isDirectory ? [] : undefined,
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

  return {
    files,
    loading,
    error,
    fileContent,
    fetchFileContent,
    updateFileContent,
  }
}
