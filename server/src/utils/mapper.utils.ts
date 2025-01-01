import { ICertificate, ICertificateInfo } from '../types/certificate.types';

/**
 * Maps raw certificate information to database model structure
 * @param certInfo Raw certificate information from SSL inspection
 * @returns Partial certificate model ready for database storage
 */
export const mapCertificateInfoToModel = (certInfo: ICertificateInfo): Partial<ICertificate> => {
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
