import https from 'https';
import { URL } from 'url';
import { TLSSocket } from 'tls';

// Add these interfaces
interface CertificateSubject {
  C?: string;  // Country
  ST?: string; // State
  L?: string;  // Locality
  O?: string;  // Organization
  OU?: string; // Organizational Unit
  CN?: string; // Common Name
}

interface DetailedCertificate {
  issuer: CertificateSubject;
  subject: CertificateSubject;
  valid_from: string;
  valid_to: string;
  serialNumber: string;
  subjectaltname?: string;
  fingerprint: string;
  bits?: number;
}

export interface CertificateInfo {
  website: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  issuedBy: string;
  serialNumber: string;
  country: string;
  state: string;
  locality: string;
  organization: string;
  organizationalUnit: string;
  commonName: string;
  alternativeNames: string[];
  fingerprint: string;
  bits: number;
}

export const getCertificateInfo = (websiteUrl: string): Promise<CertificateInfo> => {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(websiteUrl.startsWith('https://') ? websiteUrl : `https://${websiteUrl}`);
      
      const req = https.request({
        host: url.hostname,
        port: 443,
        method: 'GET',
        rejectUnauthorized: false // Allow self-signed certificates
      }, (res) => {
        const socket = res.socket as TLSSocket;
        const cert = socket.getPeerCertificate(true) as DetailedCertificate; // Add true to get detailed certificate
        
        if (!cert || Object.keys(cert).length === 0) {
          reject(new Error('No certificate found'));
          return;
        }

        // Add debug logging
        if (process.env.NODE_ENV === 'development') {
          console.log('Certificate data:', JSON.stringify(cert, null, 2));
        }

        // Safe property access with type checking
        const certInfo: CertificateInfo = {
          website: url.hostname,
          issuer: cert.issuer ? (cert.issuer.CN || 'Unknown') : 'Unknown',
          validFrom: cert.valid_from || 'Unknown',
          validTo: cert.valid_to || 'Unknown',
          issuedBy: cert.issuer ? (cert.issuer.O || 'Unknown') : 'Unknown',
          serialNumber: cert.serialNumber || 'Unknown',
          country: cert.subject ? (cert.subject.C || '') : '',
          state: cert.subject ? (cert.subject.ST || '') : '',
          locality: cert.subject ? (cert.subject.L || '') : '',
          organization: cert.subject ? (cert.subject.O || '') : '',
          organizationalUnit: cert.subject ? (cert.subject.OU || '') : '',
          commonName: cert.subject ? (cert.subject.CN || '') : '',
          alternativeNames: cert.subjectaltname ? 
            cert.subjectaltname.split(',').map(name => name.trim().replace('DNS:', '')) : [],
          fingerprint: cert.fingerprint || 'Unknown',
          bits: typeof cert.bits === 'number' ? cert.bits : 0
        };

        resolve(certInfo);
      });

      req.on('error', (e) => {
        reject(new Error(`Certificate request failed: ${e.message}`));
      });

      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('Certificate request timed out'));
      });

      req.end();
    } catch (error) {
      reject(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  });
};
