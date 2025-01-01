/**
 * Wraps async route handlers to properly catch and forward errors
 * @param fn AsyncFunction to wrap
 * @returns Express middleware function
 */
export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Validates MongoDB ObjectId format
 * @param id String to validate
 * @returns boolean indicating if string is valid ObjectId
 */
export const validateId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
