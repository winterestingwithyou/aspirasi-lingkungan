interface ApiError {
  error: string;
  issues?: { message: string }[];
}

export type { ApiError };
