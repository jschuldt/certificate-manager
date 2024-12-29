import { Router } from 'express';
import { auth } from '../middlewares';

const router = Router();

// Protected routes
router.use(auth);

// Add protected routes here
router.get('/protected', (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

export default router;
