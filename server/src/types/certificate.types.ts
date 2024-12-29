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
}
