import { ICertificate } from '../types/certificate.types';

export const validateCertificateInput = (data: Partial<ICertificate>): string[] => {
  const errors: string[] = [];
  
  if (!data.name?.trim()) {
    errors.push('Name is required');
  }
  
  if (!data.issuer?.trim()) {
    errors.push('Issuer is required');
  }
  
  if (!data.validFrom) {
    errors.push('Valid from date is required');
  }
  
  if (!data.validTo) {
    errors.push('Valid to date is required');
  }
  
  return errors;
};

export const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
