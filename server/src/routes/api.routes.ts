import { Router } from 'express';
import { getCertificateInfo } from '../utils/certificate.utils';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Certificate Manager API' });
});

router.get('/check-certificate', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const certInfo = await getCertificateInfo(url);
    res.json(certInfo);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to fetch certificate info',
      details: errorMessage
    });
  }
});

export default router;
