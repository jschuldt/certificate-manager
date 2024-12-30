export interface ICertificateMetadata {
  country?: string;
  state?: string;
  locality?: string;
  alternativeNames?: string[];
  fingerprint?: string;
  bits?: number;
}

export interface ICertificateManager {
  website?: string;
  responsiblePerson?: string;
  renewalDate?: Date;
  comments?: string;
}

export interface ICertificate {
  name?: string;
  issuer?: string;
  validFrom?: Date;
  validTo?: Date;
  serialNumber?: string;
  subject?: string;
  organization?: string;
  organizationalUnit?: string;
  certLastQueried?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: ICertificateMetadata;
  certManager: ICertificateManager;  // Required object with required website field
}
