import { Router } from 'express';
import certificateRoutes from './certificate.routes';
import userRoutes from './user.routes';
import { certificateController } from '../controllers/certificate.controller';

/**
 * Main router configuration for the certificate manager API
 * Handles route mounting and basic health check endpoints
 */
const router = Router();

/**
 * @route GET /alive
 * @description Health check endpoint to verify API status
 * @returns {Object} status and timestamp
 */
router.get('/alive', (req, res) => {
    res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

/**
 * @route GET /check-certificate
 * @description Endpoint to verify certificate validity
 * @access Public
 */
router.get('/check-certificate', certificateController.checkCertificate);

/**
 * Mount sub-routers
 * certificates - Handle all certificate-related operations
 * users - Handle user management and authentication
 */
router.use('/certificates', certificateRoutes);
router.use('/users', userRoutes);

export default router;
