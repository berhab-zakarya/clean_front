export interface FileSystemNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileSystemNode[];
}

export interface FileTreeResponse {
  tree: {
    path: string;
    type: "directory";
    children: Array<{
      path: string;
      type: "file" | "directory";
      children?: Array<{
        path: string;
        type: "file" | "directory";
        children?: Array<{
          path: string;
          type: "file" | "directory";
        }>;
      }>;
    }>;
  };
}

export interface FileContentResponse {
  path: string;
  content: string;
  last_modified?: string;
  size?: number;
}

export interface FileUpdateRequest {
  path: string;
  content: string;
}

export interface FileUpdateResponse {
  detail: string;
}

export interface ServerRestartResponse {
  detail: string;
}

export interface TenantLogsResponse {
  deployment_log: string;
  nextjs_log: string;
}

export interface FileSystemResponse {
  files: Array<{
    path: string;
    type: "file" | "directory";
  }>;
} 