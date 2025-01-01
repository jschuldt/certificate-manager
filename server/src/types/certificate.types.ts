export interface ICertificate {
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber: string;
  subject: string;
  organization: string;
  organizationalUnit: string;
  certLastQueried: Date;
  metadata: ICertificateMetadata;
  deleted: boolean;
  certManager: ICertManagerInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICertificateResponse extends ICertificate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICertificateMetadata {
  country: string;
  state: string;
  locality: string;
  alternativeNames: string[];
  fingerprint: string;
  bits: number;
}

export interface ICertManagerInfo {
  website: string;
  responsiblePerson?: string;
  alertDate?: Date;
  renewalDate?: Date;  // Add this field
  comments?: string;
}

export interface CertificateInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
}

export type CertificateStatus = 'VALID' | 'EXPIRED' | 'EXPIRING_SOON' | 'REVOKED';

export interface ICertificateFilter {
  organization?: string;
  validityStatus?: CertificateStatus;
  expiringBefore?: Date;
  issuedBy?: string;
}
