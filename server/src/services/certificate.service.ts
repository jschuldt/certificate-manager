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

  async searchCertificates(query: Partial<ICertificate> & { website?: string }): Promise<ICertificateDocument[]> {
    const searchCriteria = [];
    
    if (query.name) {
      searchCriteria.push({ name: new RegExp(String(query.name), 'i') });
    }
    if (query.issuer) {
      searchCriteria.push({ issuer: new RegExp(String(query.issuer), 'i') });
    }
    if (query.organization) {
      searchCriteria.push({ organization: new RegExp(String(query.organization), 'i') });
    }
    if (query.website) {
      searchCriteria.push({ 'certManager.website': new RegExp(String(query.website), 'i') });
    }

    return await Certificate.find(
      searchCriteria.length > 0 ? { $or: searchCriteria } : {}
    );
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
