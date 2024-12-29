export interface ICertificateMetadata {
  country: string;
  state: string;
  locality: string;
  alternativeNames: string[];
  fingerprint: string;
  bits: number;
}

export interface ICertificate {
  name: string;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  serialNumber?: string;
  subject?: string;
  organization?: string;
  organizationalUnit?: string;
  createdAt?: Date;
  updatedAt?: Date;
  metadata?: ICertificateMetadata;
}
