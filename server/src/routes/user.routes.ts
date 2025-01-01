import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/login', userController.login);
router.post('/', userController.create);
router.get('/', userController.getAll);
router.get('/search', userController.search);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;
