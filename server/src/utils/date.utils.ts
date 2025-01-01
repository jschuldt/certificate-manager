/**
 * Calculates a future date based on days from now
 * @param days Number of days to add to current date
 * @returns Date object representing future date
 */
export const calculateExpiryDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

/**
 * Checks if a date is within specified days of expiring
 * @param validTo Expiration date to check
 * @param withinDays Number of days to check within
 * @returns boolean indicating if date is within expiry window
 */
export const isExpiring = (validTo: Date, withinDays: number): boolean => {
  const expiryDate = calculateExpiryDate(withinDays);
  return validTo <= expiryDate;
};
