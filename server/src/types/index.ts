export interface BaseDocument {
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorResponse {
  message: string;
  code?: number;
  stack?: string;
}
