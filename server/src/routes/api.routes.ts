import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller';
import { getCertificateInfo } from '../utils/certificate.utils';
import { mapCertificateInfoToModel } from '../utils/mapper.utils';
import { userService } from '../services/user.service';
import { userController } from '../controllers/user.controller';

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

// Update legacy certificate check route to use controller
router.get('/check-certificate', certificateController.checkCertificate);

// User routes
router.post('/users/login', userController.login);
router.post('/users', userController.create);
router.get('/users', userController.getAll);
router.get('/users/search', userController.search);
router.get('/users/:id', userController.getById);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export default router;
