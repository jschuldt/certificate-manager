import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

/**
 * @route POST /api/users/login
 * @desc Authenticate user and return JWT token
 * @access Public
 */
router.post('/login', userController.login);

/**
 * @route POST /api/users
 * @desc Create a new user
 * @access Admin only
 */
router.post('/', userController.create);

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Admin only
 */
router.get('/', userController.getAll);

/**
 * @route GET /api/users/search
 * @desc Search users by query parameters
 * @access Admin only
 */
router.get('/search', userController.search);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Admin or Own User
 */
router.get('/:id', userController.getById);

/**
 * @route PUT /api/users/:id
 * @desc Update user by ID
 * @access Admin or Own User
 */
router.put('/:id', userController.update);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user by ID
 * @access Admin only
 */
router.delete('/:id', userController.delete);

export default router;
