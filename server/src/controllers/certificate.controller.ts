import { Request, Response } from 'express';
import { certificateService } from '../services/certificate.service';
import { validateCertificateInput, isValidMongoId } from '../utils/validation.utils';

export const certificateController = {
  async create(req: Request, res: Response) {
    try {
      const validationErrors = validateCertificateInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      const certificate = await certificateService.createCertificate(req.body);
      res.status(201).json({
        _id: certificate._id,
        ...certificate.toObject()
      });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create certificate' });
    }
  },

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

  async update(req: Request, res: Response) {
    try {
      const validationErrors = validateCertificateInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }
      const certificate = await certificateService.updateCertificate(req.params.id, req.body);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      res.json(certificate);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update certificate' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const certificate = await certificateService.deleteCertificate(req.params.id);
      if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete certificate' });
    }
  },

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

      const result = await certificateService.bulkCreateCertificates(req.body);
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
  }
};
