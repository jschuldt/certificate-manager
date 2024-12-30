import { ICertificate } from '../types/certificate.types';
import Certificate, { ICertificateDocument } from '../models/certificate.model';

export class CertificateService {
  async createCertificate(certificateData: ICertificate): Promise<ICertificateDocument> {
    const certificate = new Certificate(certificateData);
    return await certificate.save();
  }

  async getAllCertificates(page: number = 1, limit: number = 10): Promise<{
    certificates: ICertificateDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      Certificate.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Certificate.countDocuments()
    ]);

    return {
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
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

  async bulkCreateCertificates(certificatesData: ICertificate[]): Promise<{
    successful: ICertificateDocument[];
    failed: Array<{ data: ICertificate; error: string }>;
  }> {
    const results = {
      successful: [] as ICertificateDocument[],
      failed: [] as Array<{ data: ICertificate; error: string }>
    };

    try {
      // Process certificates in sequence
      for (const certData of certificatesData) {
        try {
          // Ensure certManager and website exist
          if (!certData.certManager?.website) {
            results.failed.push({
              data: certData,
              error: 'Missing required certManager.website'
            });
            continue;
          }

          const certificate = new Certificate(certData);
          const savedCert = await certificate.save();
          results.successful.push(savedCert);
        } catch (error) {
          console.error('Individual certificate save error:', error);
          results.failed.push({
            data: certData,
            error: error instanceof Error ? error.message : 'Unknown error saving certificate'
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Bulk create operation error:', error);
      throw new Error('Failed to process bulk certificate creation');
    }
  }
}

export const certificateService = new CertificateService();
