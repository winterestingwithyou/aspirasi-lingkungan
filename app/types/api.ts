export interface ApiError {
  error: string;
  issues?: { message: string }[];
}
