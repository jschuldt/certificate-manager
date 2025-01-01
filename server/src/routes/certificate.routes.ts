import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller';

const router = Router();

router.post('/', certificateController.create);
router.get('/', certificateController.getAll);
router.get('/search', certificateController.search);
router.get('/expiring/:days', certificateController.getExpiring);
router.get('/:id', certificateController.getById);
router.put('/:id', certificateController.update);
router.delete('/:id', certificateController.delete);
router.post('/bulk', certificateController.bulkCreate);

export default router;
