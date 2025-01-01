import { ICertificate } from '../types/certificate.types';
import Certificate, { ICertificateDocument } from '../models/certificate.model';

/**
 * Service class handling all certificate-related operations
 * @class CertificateService
 */
export class CertificateService {
  /**
   * Creates a new certificate
   * @param {ICertificate} certificateData - The certificate data to create
   * @returns {Promise<ICertificateDocument>} The created certificate
   */
  async createCertificate(certificateData: ICertificate): Promise<ICertificateDocument> {
    const certificate = new Certificate(certificateData);
    return await certificate.save();
  }

  /**
   * Retrieves a paginated list of all non-deleted certificates
   * @param {number} page - Page number for pagination (default: 1)
   * @param {number} limit - Number of items per page (default: 10)
   * @returns {Promise<{certificates: ICertificateDocument[]; total: number; page: number; totalPages: number;}>}
   */
  async getAllCertificates(page: number = 1, limit: number = 10): Promise<{
    certificates: ICertificateDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const [certificates, total] = await Promise.all([
      Certificate.find({ deleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Certificate.countDocuments({ deleted: { $ne: true } })
    ]);

    return {
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Retrieves a single certificate by its ID
   * @param {string} id - The certificate ID
   * @returns {Promise<ICertificateDocument | null>} The certificate if found, null otherwise
   */
  async getCertificateById(id: string): Promise<ICertificateDocument | null> {
    return await Certificate.findOne({ _id: id, deleted: { $ne: true } });
  }

  /**
   * Updates a certificate's information
   * @param {string} id - The certificate ID
   * @param {Partial<ICertificate>} certificateData - The data to update
   * @returns {Promise<ICertificateDocument | null>} The updated certificate if found
   */
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

  /**
   * Soft deletes a certificate
   * @param {string} id - The certificate ID
   * @returns {Promise<ICertificateDocument | null>} The deleted certificate
   */
  async deleteCertificate(id: string): Promise<ICertificateDocument | null> {
    return await Certificate.findByIdAndUpdate(
      id,
      { $set: { deleted: true } },
      { new: true }
    );
  }

  /**
   * Searches for certificates based on multiple criteria
   * @param {Object} query - Search parameters including pagination
   * @returns {Promise<{certificates: ICertificateDocument[]; total: number; page: number; totalPages: number;}>}
   */
  async searchCertificates(
    query: Partial<ICertificate> & { 
      website?: string;
      responsiblePerson?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    certificates: ICertificateDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    
    // Create search criteria object
    const searchConditions: any[] = [{ deleted: { $ne: true } }];
    
    if (query.name) {
      searchConditions.push({ name: new RegExp(String(query.name), 'i') });
    }
    if (query.issuer) {
      searchConditions.push({ issuer: new RegExp(String(query.issuer), 'i') });
    }
    if (query.organization) {
      searchConditions.push({ organization: new RegExp(String(query.organization), 'i') });
    }
    if (query.website) {
      searchConditions.push({ 'certManager.website': new RegExp(String(query.website), 'i') });
    }
    if (query.responsiblePerson) {
      searchConditions.push({ 'certManager.responsiblePerson': new RegExp(String(query.responsiblePerson), 'i') });
    }

    const filter = { $and: searchConditions };

    const [certificates, total] = await Promise.all([
      Certificate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Certificate.countDocuments(filter)
    ]);

    return {
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Retrieves certificates that are approaching expiration
   * @param {number} daysThreshold - Number of days to consider for expiration
   * @param {number} page - Page number for pagination
   * @param {number} limit - Number of items per page
   * @returns {Promise<{certificates: ICertificateDocument[]; total: number; page: number; totalPages: number;}>}
   */
  async getExpiringCertificates(
    daysThreshold: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    certificates: ICertificateDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
    
    const filter = {
      validTo: {
        $gte: new Date(),
        $lte: thresholdDate
      }
    };

    const [certificates, total] = await Promise.all([
      Certificate.find(filter)
        .sort({ validTo: 1 })
        .skip(skip)
        .limit(limit),
      Certificate.countDocuments(filter)
    ]);

    return {
      certificates,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Bulk creates multiple certificates
   * @param {ICertificate[]} certificatesData - Array of certificate data to create
   * @returns {Promise<{successful: ICertificateDocument[]; failed: Array<{data: ICertificate; error: string}>;}>}
   */
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
