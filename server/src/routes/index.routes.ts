import { Router } from 'express';
import certificateRoutes from './certificate.routes';
import userRoutes from './user.routes';
import systemRoutes from './system.routes';

/**
 * Main router configuration for the certificate manager API
 * Handles route mounting and basic health check endpoints
 */
const router = Router();

/**
 * Mount sub-routers
 * certificates - Handle all certificate-related operations
 * users - Handle user management and authentication
 * system - Handle system-related operations
 */
router.use('/system', systemRoutes);
router.use('/certificates', certificateRoutes);
router.use('/users', userRoutes);

export default router;
