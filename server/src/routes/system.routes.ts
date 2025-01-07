import { Router } from 'express';
import { systemController } from '../controllers/system.controller';

const router = Router();

/**
 * @route GET /system/alive
 * @description Health check endpoint to verify API status
 * @returns {Object} status and timestamp
 */
router.get('/alive', systemController.healthCheck);

/**
 * @route POST /system/email
 * @description Send email using configured SMTP settings
 * @body {Object} emailData - Contains to, subject, and message
 * @returns {Object} success status and message
 */
router.post('/email', systemController.sendEmail);

/**
 * @route PUT /system/smtp
 * @description Update SMTP settings
 * @body {Object} smtpData - Contains SMTP configuration details
 * @returns {Object} success status and message
 */
router.put('/smtp', systemController.updateSmtpSettings);

/**
 * @route GET /system/smtp
 * @description Get current SMTP settings
 * @returns {Object} SMTP configuration details
 */
router.get('/smtp', systemController.getSmtpSettings);

export default router;
