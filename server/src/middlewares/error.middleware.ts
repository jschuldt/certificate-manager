import { Request, Response, NextFunction } from 'express';

/**
 * Custom API Error class for handling HTTP errors
 * Extends the native Error class with an additional statusCode property
 */
export class ApiError extends Error {
  statusCode: number;
  
  /**
   * Creates a new ApiError instance
   * @param statusCode - HTTP status code for the error
   * @param message - Error message to be sent to the client
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Global error handling middleware
 * Processes errors and sends appropriate response to client
 * 
 * @param err - Error object (either ApiError or standard Error)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Response with error details
 */
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    message: 'Internal Server Error'
  });
};
