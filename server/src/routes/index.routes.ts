import { Router } from 'express';
import certificateRoutes from './certificate.routes';
import userRoutes from './user.routes';

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
 * Mount sub-routers
 * certificates - Handle all certificate-related operations
 * users - Handle user management and authentication
 */
router.use('/certificates', certificateRoutes);
router.use('/users', userRoutes);

export default router;
