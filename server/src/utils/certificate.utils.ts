import https from 'https';
import { URL } from 'url';
import { TLSSocket } from 'tls';

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
      }, (res) => {
        const socket = res.socket as TLSSocket;
        const cert = socket.getPeerCertificate();
        
        if (!cert) {
          reject(new Error('No certificate found'));
          return;
        }

        resolve({
          website: url.hostname,
          issuer: cert.issuer.CN || 'Unknown',
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          issuedBy: cert.issuer.O || 'Unknown',
          serialNumber: cert.serialNumber || '',
          country: cert.subject.C || '',
          state: cert.subject.ST || '',
          locality: cert.subject.L || '',
          organization: cert.subject.O || '',
          organizationalUnit: cert.subject.OU || '',
          commonName: cert.subject.CN || '',
          alternativeNames: cert.subjectaltname ? 
            cert.subjectaltname.split(',').map(name => name.trim().replace('DNS:', '')) : [],
          fingerprint: cert.fingerprint || '',
          bits: cert.bits || 0
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    } catch (error) {
      reject(error);
    }
  });
};
