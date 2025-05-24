import { useState, useEffect } from 'react';
import { filesAPI } from '../lib/api/api';

interface UseFileContentResult {
  content: string | null;
  path: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFileContent = (subdomain: string, filePath: string): UseFileContentResult => {
  const [content, setContent] = useState<string | null>(null);
  const [path, setPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFileContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await filesAPI.getFileContent(subdomain, filePath);
      setContent(response.content);
      setPath(response.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch file content');
      setContent(null);
      setPath(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subdomain && filePath) {
      fetchFileContent();
    }
  }, [subdomain, filePath]);

  return {
    content,
    path,
    isLoading,
    error,
    refetch: fetchFileContent
  };
}; 