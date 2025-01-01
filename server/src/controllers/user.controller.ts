import { Request, Response } from 'express';
import { userService } from '../services/user.service';

/**
 * User controller handling all user-related HTTP requests
 */
export const userController = {
    /**
     * Authenticate user with email and password
     * @param req.body.email - User's email address
     * @param req.body.password - User's password
     * @returns User object with auth token if successful
     */
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            const user = await userService.login(email, password);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            res.json(user);
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            res.status(500).json({ error: 'Login failed', details: errorMessage });
        }
    },

    /**
     * Create a new user account
     * @param req.body - User creation payload containing user details
     * @returns Newly created user object
     */
    async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create user' });
        }
    },

    /**
     * Retrieve paginated list of users
     * @param req.query.page - Page number for pagination (default: 1)
     * @param req.query.limit - Number of items per page (default: 10)
     * @returns Paginated list of users
     */
    async getAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await userService.getAll(page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    /**
     * Search users based on various criteria
     * @param req.query.query - General search query
     * @param req.query.firstName - Filter by first name
     * @param req.query.lastName - Filter by last name
     * @param req.query.email - Filter by email
     * @returns Filtered list of users matching criteria
     */
    async search(req: Request, res: Response) {
        try {
            const { query, firstName, lastName, email } = req.query;
            const searchParams: any = {};

            if (query) searchParams.query = query;
            if (firstName) searchParams.firstName = firstName;
            if (lastName) searchParams.lastName = lastName;
            if (email) searchParams.email = email;

            const users = await userService.search(searchParams);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Failed to search users' });
        }
    },

    /**
     * Retrieve a specific user by ID
     * @param req.params.id - User ID to fetch
     * @returns Single user object if found
     */
    async getById(req: Request, res: Response) {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    /**
     * Update an existing user's information
     * @param req.params.id - User ID to update
     * @param req.body - Updated user data
     * @returns Updated user object
     */
    async update(req: Request, res: Response) {
        try {
            const user = await userService.update(req.params.id, req.body);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update user' });
        }
    },

    /**
     * Delete a user from the system
     * @param req.params.id - User ID to delete
     * @returns 204 No Content if successful
     */
    async delete(req: Request, res: Response) {
        try {
            const success = await userService.delete(req.params.id);
            if (!success) return res.status(404).json({ error: 'User not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
};
