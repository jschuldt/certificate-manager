import { Router } from 'express';

const router = Router();

/**
 * @route GET /system/alive
 * @description Health check endpoint to verify API status
 * @returns {Object} status and timestamp
 */
router.get('/alive', (req, res) => {
    res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

export default router;
