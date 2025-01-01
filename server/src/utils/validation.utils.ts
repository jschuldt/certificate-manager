import { ICertificate } from '../types/certificate.types';

/**
 * Represents a validation error with field name and error message
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates required fields and schema constraints
 * @param data Partial certificate data to validate
 * @returns Array of validation errors, empty if valid
 */
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

/**
 * Validates business logic rules such as date relationships
 * @param data Partial certificate data to validate
 * @returns Array of validation errors, empty if valid
 */
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

/**
 * Validates format-specific rules like URL format
 * @param data Partial certificate data to validate
 * @returns Array of validation errors, empty if valid
 */
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

/**
 * Main validation function that combines all validation checks
 * @param data Partial certificate data to validate
 * @returns Combined array of all validation errors
 */
export const validateCertificateInput = (data: Partial<ICertificate>): ValidationError[] => {
  return [
    ...validateSchema(data),
    ...validateBusinessRules(data),
    ...validateFormats(data)
  ];
};

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id String to validate
 * @returns boolean indicating if string is valid MongoDB ObjectId
 */
export const isValidMongoId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validates if a string is a valid URL
 * @param url String to validate
 * @returns boolean indicating if string is valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}
