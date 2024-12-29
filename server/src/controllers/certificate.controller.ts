import { Request, Response } from 'express';
import { certificateService } from '../services/certificate.service';
import { validateCertificateInput, isValidMongoId } from '../utils/validation.utils';

export const certificateController = {
  async create(req: Request, res: Response) {
    try {
      const errors = validateCertificateInput(req.body);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }
      const certificate = await certificateService.createCertificate(req.body);
      res.status(201).json(certificate);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create certificate' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const certificates = await certificateService.getAllCertificates();
      res.json(certificates);
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
      const certificates = await certificateService.searchCertificates(req.query);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search certificates' });
    }
  },

  async getExpiring(req: Request, res: Response) {
    try {
      const days = parseInt(req.params.days) || 30;
      const certificates = await certificateService.getExpiringCertificates(days);
      res.json(certificates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch expiring certificates' });
    }
  }
};
