export const calculateExpiryDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const isExpiring = (validTo: Date, withinDays: number): boolean => {
  const expiryDate = calculateExpiryDate(withinDays);
  return validTo <= expiryDate;
};
