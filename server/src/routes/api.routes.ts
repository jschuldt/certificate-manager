import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller';
import { getCertificateInfo } from '../utils/certificate.utils';
import { mapCertificateInfoToModel } from '../utils/mapper.utils';
import { userService } from '../services/user.service';

const router = Router();

// Change welcome route to alive route
router.get('/alive', (req, res) => {
  res.json({ status: 'alive', timestamp: new Date().toISOString() });
});

// Certificate routes
router.post('/certificates', certificateController.create);
router.get('/certificates', certificateController.getAll);
router.get('/certificates/search', certificateController.search);
router.get('/certificates/expiring/:days', certificateController.getExpiring);
router.get('/certificates/:id', certificateController.getById);
router.put('/certificates/:id', certificateController.update);
router.delete('/certificates/:id', certificateController.delete);

// Add this new route
router.post('/certificates/bulk', certificateController.bulkCreate);

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

// User routes
router.post('/users', async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await userService.getAll(page, limit);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const success = await userService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/users/search', async (req, res) => {
  try {
    const users = await userService.search(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
});

export default router;
