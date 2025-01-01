import { Router } from 'express';
import certificateRoutes from './certificate.routes';
import userRoutes from './user.routes';
import { certificateController } from '../controllers/certificate.controller';

const router = Router();

router.get('/alive', (req, res) => {
    res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

router.get('/check-certificate', certificateController.checkCertificate);
router.use('/certificates', certificateRoutes);
router.use('/users', userRoutes);

export default router;
