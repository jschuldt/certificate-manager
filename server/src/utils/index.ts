export const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const validateId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
