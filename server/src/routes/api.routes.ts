import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller';
import { getCertificateInfo } from '../utils/certificate.utils';
import { mapCertificateInfoToModel } from '../utils/mapper.utils';

const router = Router();

// Welcome route
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Certificate Manager API' });
});

// Certificate routes
router.post('/certificates', certificateController.create);
router.get('/certificates', certificateController.getAll);
router.get('/certificates/search', certificateController.search);
router.get('/certificates/expiring/:days', certificateController.getExpiring);
router.get('/certificates/:id', certificateController.getById);
router.put('/certificates/:id', certificateController.update);
router.delete('/certificates/:id', certificateController.delete);

// Legacy certificate check route
router.get('/check-certificate', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const certInfo = await getCertificateInfo(url);
    const mappedCertificate = mapCertificateInfoToModel(certInfo);
    res.json(mappedCertificate);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to fetch certificate info',
      details: errorMessage
    });
  }
});

export default router;
