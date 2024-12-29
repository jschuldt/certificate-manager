import { ICertificate } from '../types/certificate.types';
import Certificate, { ICertificateDocument } from '../models/certificate.model';

export class CertificateService {
  async createCertificate(certificateData: ICertificate): Promise<ICertificateDocument> {
    const certificate = new Certificate(certificateData);
    return await certificate.save();
  }

  async getAllCertificates(): Promise<ICertificateDocument[]> {
    return await Certificate.find().sort({ createdAt: -1 });
  }

  async getCertificateById(id: string): Promise<ICertificateDocument | null> {
    return await Certificate.findById(id);
  }

  async updateCertificate(
    id: string,
    certificateData: Partial<ICertificate>
  ): Promise<ICertificateDocument | null> {
    return await Certificate.findByIdAndUpdate(
      id,
      { $set: certificateData },
      { new: true }
    );
  }

  async deleteCertificate(id: string): Promise<ICertificateDocument | null> {
    return await Certificate.findByIdAndDelete(id);
  }

  async searchCertificates(query: Partial<ICertificate>): Promise<ICertificateDocument[]> {
    return await Certificate.find({
      $or: [
        { name: new RegExp(String(query.name), 'i') },
        { issuer: new RegExp(String(query.issuer), 'i') },
        { organization: new RegExp(String(query.organization), 'i') }
      ]
    });
  }

  async getExpiringCertificates(daysThreshold: number): Promise<ICertificateDocument[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    return await Certificate.find({
      validTo: {
        $gte: new Date(),
        $lte: thresholdDate
      }
    }).sort({ validTo: 1 });
  }
}

export const certificateService = new CertificateService();
