export interface FileSystemNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileSystemNode[];
}

export interface FileSystemResponse {
  files: Array<{
    path: string;
    type: "file" | "directory";
  }>;
} 