/** Shared Admin API envelope shapes */

export type ApiErrorBody = {
  error?: { message?: string; code?: string; type?: string };
  message?: string;
};

export type ListResponse<T> = {
  object?: string;
  total: number;
  limit?: number;
  offset?: number;
  data: T[];
};

export type DataResponse<T> = {
  object?: string;
  data: T;
};
