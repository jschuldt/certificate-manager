import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
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

    async create(req: Request, res: Response) {
        try {
            const user = await userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Failed to create user' });
        }
    },

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

    async getById(req: Request, res: Response) {
        try {
            const user = await userService.getById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch user' });
        }
    },

    async update(req: Request, res: Response) {
        try {
            const user = await userService.update(req.params.id, req.body);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: 'Failed to update user' });
        }
    },

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
