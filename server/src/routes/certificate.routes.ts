import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller';

const router = Router();

// Pull certificate information from URL (moved to top)
router.get('/pull', certificateController.checkCertificate);

// Search certificates based on query parameters
router.get('/search', certificateController.search);

// Get certificates expiring within specified days
router.get('/expiring/:days', certificateController.getExpiring);

// Create multiple certificates in a single request
router.post('/bulk', certificateController.bulkCreate);

// Create a new certificate
router.post('/', certificateController.create);

// Retrieve all certificates
router.get('/', certificateController.getAll);

// Get certificate by ID
router.get('/:id', certificateController.getById);

// Update certificate by ID
router.put('/:id', certificateController.update);

// Delete certificate by ID
router.delete('/:id', certificateController.delete);

// Refresh certificate information from website
router.post('/:id/refresh', certificateController.refreshCertificate);

export default router;
