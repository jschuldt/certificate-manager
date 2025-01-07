/**
 * Parameters for pagination requests
 * @interface IPaginationParams
 */
export interface IPaginationParams {
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Field to sort by */
    sortBy?: string;
    /** Sort direction */
    sortOrder?: 'asc' | 'desc';
}

/**
 * Standard API response wrapper
 * @interface IApiResponse
 * @template T - Type of data being returned
 */
export interface IApiResponse<T> {
    /** Indicates if the operation was successful */
    success: boolean;
    /** Response payload */
    data?: T;
    /** Error message if operation failed */
    error?: string;
    /** Pagination metadata */
    metadata?: {
        /** Total number of items */
        total: number;
        /** Current page number */
        page: number;
        /** Total number of pages */
        totalPages: number;
    };
}

/**
 * Standard error response structure
 * @interface IErrorResponse
 */
export interface IErrorResponse {
    /** Error code identifier */
    code: string;
    /** Human-readable error message */
    message: string;
    /** Additional error details */
    details?: unknown;
}

/** Application environment type */
export type Environment = 'development' | 'production' | 'test';

export type SmtpService = 'GMAIL' | 'OUTLOOK' | 'HOTMAIL' | 'YAHOO' | 'CUSTOM';

export interface ISmtpConfig {
    service: SmtpService;
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromAddress: string;
    replyTo?: string;
    tls?: {
        rejectUnauthorized: boolean;
    };
    maxRetries?: number;
    timeout?: number;
    isDefault?: boolean;
    lastTested?: Date;
    testResult?: {
        success: boolean;
        message: string;
        timestamp: Date;
    };
}

/**
 * System configuration structure
 * @interface ISystemConfig
 */
export interface ISystemConfig {
    systemComponent: 'SMTP' | 'OAuth' | 'AWS' | string;
    componentConfig: ISmtpConfig | Record<string, any>;
    lastUpdated?: Date;
    status: 'active' | 'inactive' | 'error';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
