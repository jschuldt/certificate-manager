import { Request, Response } from 'express';
import { certificateService } from '../services/certificate.service';
import { validateCertificateInput, isValidMongoId } from '../utils/validation.utils';
import { getCertificateInfo } from '../utils/certificate.utils';
import { mapCertificateInfoToModel } from '../utils/mapper.utils';

/**
 * Transforms the flat request body into a nested certificate schema
 * @param body - The request body containing certificate data
 * @returns Transformed certificate object with nested metadata
 */
const transformRequestToSchema = (body: any) => {
  const {
    metadataCountry,
    metadataState,
    metadataLocality,
    metadataAlternativeNames,
    metadataFingerprint,
    metadataBits,
    metadataWebsite,
    metadataResponsiblePerson,
    metadataRenewalDate,
    metadataComments,
    ...rest
  } = body;

  return {
    ...rest,
    metadata: {
      country: metadataCountry,
      state: metadataState,
      locality: metadataLocality,
      alternativeNames: metadataAlternativeNames,
      fingerprint: metadataFingerprint,
      bits: metadataBits
    }
  };
};

/**
 * Validates if a string is a valid HTTP/HTTPS URL
 * @param urlString - URL to validate
 * @returns boolean indicating if URL is valid
 */
const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

/**
 * Certificate controller handling all certificate-related HTTP requests
 */
export const certificateController = {
  /**
   * Create a new certificate
   * @param req.body - Certificate creation payload
   * @returns Newly created certificate object
   */
  async create(req: Request, res: Response) {
    try {
      const validationErrors = validateCertificateInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      const transformedData = transformRequestToSchema(req.body);
      const certificate = await certificateService.createCertificate(transformedData);
      res.status(201).json({
        _id: certificate._id,
        ...certificate.toObject()
      });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create certificate' });
    }
  },

  /**
   * Retrieve a paginated list of certificates
   * @param req.query.page - Page number (default: 1)
   * @param req.query.limit - Items per page (default: 10)
   * @returns Paginated list of certificates
   */
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await certificateService.getAllCertificates(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certificates' });
    }
  },

  /**
   * Retrieve a specific certificate by ID
   * @param req.params.id - Certificate ID
   * @returns Single certificate object
   */
  async getById(req: Request, res: Response) {
    try {
      if (!isValidMongoId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid certificate ID' });
      }
      const certificate = await certificateService.getCertificateById(req.params.id);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch certificate' });
    }
  },

  /**
   * Update an existing certificate
   * @param req.params.id - Certificate ID to update
   * @param req.body - Updated certificate data
   * @returns Updated certificate object
   */
  async update(req: Request, res: Response) {
    try {
      const validationErrors = validateCertificateInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      const transformedData = transformRequestToSchema(req.body);
      const certificate = await certificateService.updateCertificate(req.params.id, transformedData);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      res.json(certificate);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update certificate' });
    }
  },

  /**
   * Delete a certificate
   * @param req.params.id - Certificate ID to delete
   * @returns 204 No Content if successful
   */
  async delete(req: Request, res: Response) {
    try {
      const certificate = await certificateService.deleteCertificate(req.params.id);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete certificate' });
    }
  },

  /**
   * Search certificates with pagination
   * @param req.query - Search parameters
   * @param req.query.page - Page number (default: 1)
   * @param req.query.limit - Items per page (default: 10)
   * @returns Paginated search results
   */
  async search(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await certificateService.searchCertificates({ ...req.query, page, limit });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search certificates' });
    }
  },

  /**
   * Get certificates expiring within specified days
   * @param req.params.days - Number of days to check expiration (default: 30)
   * @param req.query.page - Page number (default: 1)
   * @param req.query.limit - Items per page (default: 10)
   * @returns Paginated list of expiring certificates
   */
  async getExpiring(req: Request, res: Response) {
    try {
      const days = parseInt(req.params.days) || 30;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await certificateService.getExpiringCertificates(days, page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expiring certificates' });
    }
  },

  /**
   * Create multiple certificates in bulk
   * @param req.body - Array of certificate objects to create
   * @returns Object containing successful and failed operations
   */
  async bulkCreate(req: Request, res: Response) {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Request body must be an array of certificates' });
      }

      if (req.body.length === 0) {
        return res.status(400).json({ error: 'Array cannot be empty' });
      }

      const validationErrors = req.body.map((cert, index) => ({
        index,
        errors: validateCertificateInput(cert)
      })).filter(result => result.errors.length > 0);

      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      const transformedData = req.body.map(transformRequestToSchema);
      const result = await certificateService.bulkCreateCertificates(transformedData);
      res.status(201).json({
        message: `Successfully created ${result.successful.length} certificates, ${result.failed.length} failed`,
        ...result
      });
    } catch (error) {
      console.error('Bulk create error:', error); // Add error logging
      res.status(500).json({
        error: 'Failed to create certificates',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  /**
   * Check and retrieve certificate information from a URL
   * @param req.query.url - URL to check certificate
   * @returns Certificate information from the URL
   */
  async checkCertificate(req: Request, res: Response) {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // Validate and format URL
      if (!isValidUrl(url)) {
        return res.status(400).json({ error: 'Invalid URL format. Must be a valid HTTP/HTTPS URL' });
      }

      // Ensure URL starts with https:// or http://
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

      const certInfo = await getCertificateInfo(formattedUrl);
      const mappedCertificate = mapCertificateInfoToModel(certInfo);
      res.json(mappedCertificate);
    } catch (error: unknown) {
      console.error('Certificate check error:', error); // Add logging
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({
        error: 'Failed to fetch certificate info',
        details: errorMessage
      });
    }
  },

  /**
   * Refresh certificate information from website
   * @param req.params.id - Certificate ID
   * @param req.query.website - Website URL
   * @returns Updated certificate object
   */
  async refreshCertificate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { website } = req.query;

      if (!website || typeof website !== 'string') {
        return res.status(400).json({ error: 'Website parameter is required' });
      }

      if (!isValidMongoId(id)) {
        return res.status(400).json({ error: 'Invalid certificate ID' });
      }

      // Validate URL format
      if (!isValidUrl(website)) {
        return res.status(400).json({ error: 'Invalid website URL format' });
      }

      const updatedCertificate = await certificateService.refreshCertificate(id, website);
      if (!updatedCertificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      res.json(updatedCertificate);
    } catch (error) {
      console.error('Certificate refresh error:', error);
      res.status(500).json({
        error: 'Failed to refresh certificate',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
};
