import { ICertificate } from '../types/certificate.types';
import { CertificateInfo } from './certificate.utils';

export const mapCertificateInfoToModel = (certInfo: CertificateInfo): Partial<ICertificate> => {
  return {
    name: certInfo.website,
    issuer: certInfo.issuer,
    validFrom: new Date(certInfo.validFrom),
    validTo: new Date(certInfo.validTo),
    serialNumber: certInfo.serialNumber,
    subject: certInfo.commonName,
    organization: certInfo.organization,
    organizationalUnit: certInfo.organizationalUnit,
    // You can add custom fields to store additional data
    metadata: {
      country: certInfo.country,
      state: certInfo.state,
      locality: certInfo.locality,
      alternativeNames: certInfo.alternativeNames,
      fingerprint: certInfo.fingerprint,
      bits: certInfo.bits
    }
  };
};