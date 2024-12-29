import { Router } from 'express';
import apiRoutes from './api.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API routes
router.use('/v1', apiRoutes);

export default router;
