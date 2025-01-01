import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

/**
 * Authentication middleware
 * Validates JWT tokens from the Authorization header
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns Calls next() if authenticated, throws error if not
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    // TODO: Implement JWT verification
    // Expected implementation:
    // 1. Verify token using JWT library
    // 2. Decode user information
    // 3. Attach user to request object
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid token'));
  }
};
