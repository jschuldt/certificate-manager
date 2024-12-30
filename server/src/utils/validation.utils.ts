import { ICertificate } from '../types/certificate.types';

export interface ValidationError {
  field: string;
  message: string;
}

// Schema validation
export const validateSchema = (data: Partial<ICertificate>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Only website is required
  if (!data.certManager?.website?.trim()) {
    errors.push({
      field: 'certManager.website',
      message: 'Website is required in certManager'
    });
  }

  return errors;
};

// Business rule validation
export const validateBusinessRules = (data: Partial<ICertificate>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Date validation
  if (data.validFrom && data.validTo) {
    const fromDate = new Date(data.validFrom);
    const toDate = new Date(data.validTo);
    if (fromDate > toDate) {
      errors.push({
        field: 'validDates',
        message: 'Valid from date must be before valid to date'
      });
    }
  }

  // Renewal date validation
  if (data.certManager?.renewalDate && data.validTo) {
    const renewalDate = new Date(data.certManager.renewalDate);
    const validToDate = new Date(data.validTo);
    if (renewalDate > validToDate) {
      errors.push({
        field: 'certManager.renewalDate',
        message: 'Renewal date cannot be after certificate expiry date'
      });
    }
  }

  return errors;
};

// Format validation
export const validateFormats = (data: Partial<ICertificate>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // URL format validation
  if (data.certManager?.website && !isValidUrl(data.certManager.website)) {
    errors.push({
      field: 'certManager.website',
      message: 'Website must be a valid URL'
    });
  }

  return errors;
};

// Main validation function that combines all validations
export const validateCertificateInput = (data: Partial<ICertificate>): ValidationError[] => {
  return [
    ...validateSchema(data),
    ...validateBusinessRules(data),
    ...validateFormats(data)
  ];
};

// Utility functions
export const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}
