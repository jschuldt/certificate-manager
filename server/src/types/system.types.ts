export interface IPaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        total: number;
        page: number;
        totalPages: number;
    };
}

export interface IErrorResponse {
    code: string;
    message: string;
    details?: unknown;
}

export type Environment = 'development' | 'production' | 'test';
