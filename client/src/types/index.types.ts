import React from 'react';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Component Props Types
export interface MainLayoutProps {
  children: React.ReactNode;
}

// Navigation Types
export interface MenuItem {
  text: string;
  icon: React.ReactElement;  // Changed from JSX.Element to React.ReactElement
  path: string;
}

// Certificate Types
export interface CertificateMetadata {
  country: string | null;
  state: string | null;
  locality: string | null;
  alternativeNames: string[] | null;
  fingerprint: string | null;
  bits: number | null;
}

export interface CertManager {
  website: string;
  responsiblePerson: string;
  alertDate?: string;
  comments: string;
}

export interface Certificate {
  _id: string;
  id: string;
  name: string | null;
  issuer: string | null;
  validFrom: string | null;
  validTo: string | null;
  serialNumber: string | null;
  subject: string | null;
  organization: string | null;
  organizationalUnit: string | null;
  certLastQueried: string | null;
  metadata: CertificateMetadata | null;
  certManager: CertManager;
}

// Form Types
export interface CertificateFormData {
  website: string;
  responsiblePerson: string;
  renewalDueDate: Date;
  comments: string;
}

export interface CertificateDetailsFormData {
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  subject: string;
  organization: string;
  organizationalUnit: string;
  certLastQueried: string | null;
  metadata: CertificateMetadata;
}

// API Types
export interface CertificateSearchParams {
  name?: string;
  issuer?: string;
  website?: string;
  organization?: string;
  responsiblePerson?: string;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  certificates: Certificate[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CertificateResponse {
  message: string;
  queryUrl: string;
  timestamp: string;
}

export interface ErrorDetails {
  message: string;
  technical?: string;
}

export interface CertificateUpdateParams {
  website: string;
  responsiblePerson: string;
  alertDate?: string;
  comments: string;
}

export interface CreateCertificateData {
  certManager: {
    website: string;
    responsiblePerson: string;
    alertDate: string;
    comments: string;
  };
}

// UI Types
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Column {
  id: string;
  label: string;
  getValue: (cert: Certificate) => string | number | null;
}

// MaintainCert Component Types
export interface CertificateField {
  label: string;
  value: string | number | null;
  type: 'text' | 'date' | 'number';
}

// CreateCertificate Component Types
export interface CertificateDetails {
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  subject: string;
  organization: string;
  organizationalUnit: string;
  certLastQueried: string | null;
  metadata: {
    country: string;
    state: string;
    locality: string;
    alternativeNames: string[];
    fingerprint: string;
    bits: number | null;
  };
}

export interface CreateCertFormData {
  website: string;
  responsiblePerson: string;
  renewalDueDate: Date;
  comments: string;
}

export interface CreateCertificateDetails {
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  subject: string;
  organization: string;
  organizationalUnit: string;
  certLastQueried: string | null;
  metadata: {
    country: string;
    state: string;
    locality: string;
    alternativeNames: string[];
    fingerprint: string;
    bits: number | null;
  };
}
