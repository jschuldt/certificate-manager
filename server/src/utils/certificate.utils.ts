import https from 'https';
import { URL } from 'url';
import { TLSSocket } from 'tls';

interface CertificateInfo {
  website: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  issuedBy: string;
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
