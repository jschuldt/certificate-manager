import { ApiError } from '../middlewares/error.middleware';

export class BaseService {
  protected handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error.message || 'Internal Server Error');
  }
}
