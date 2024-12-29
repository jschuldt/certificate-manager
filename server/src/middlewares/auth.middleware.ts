import { Request, Response, NextFunction } from 'express';
import { ApiError } from './error.middleware';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    // TODO: Implement JWT verification
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid token'));
  }
};
