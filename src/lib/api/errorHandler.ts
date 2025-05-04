export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
      this.name = 'ApiError';
    }
  }
  
  export const handleApiError = (error: unknown): never => {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    }
    throw new ApiError('An unexpected error occurred', 500);
  };