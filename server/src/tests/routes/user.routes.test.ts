import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/user.routes';
import { userController } from '../../controllers/user.controller';

jest.mock('../../controllers/user.controller');

const app = express();
app.use(express.json());
app.use('/', userRoutes);

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Testing routes in order they appear in user.routes.ts
    it('POST /login - should login user', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.login as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUser);
        });

        await request(app)
            .post('/login')
            .send({ email: 'test@test.com', password: 'password' })
            .expect(200)
            .expect(mockUser);
    });

    it('POST / - should create user', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json(mockUser);
        });

        await request(app)
            .post('/')
            .send({ email: 'test@test.com', password: 'password' })
            .expect(201)
            .expect(mockUser);
    });

    it('GET / - should get all users', async () => {
        const mockUsers = [{ id: '1', email: 'test@test.com' }];
        (userController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUsers);
        });

        await request(app)
            .get('/')
            .expect(200)
            .expect(mockUsers);
    });

    it('GET /search - should search users', async () => {
        const mockResults = [{ id: '1', email: 'test@test.com' }];
        (userController.search as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockResults);
        });

        await request(app)
            .get('/search?query=test')
            .expect(200)
            .expect(mockResults);
    });

    it('GET /:id - should get user by id', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUser);
        });

        await request(app)
            .get('/1')
            .expect(200)
            .expect(mockUser);
    });

    it('PUT /:id - should update user', async () => {
        const mockUpdated = { id: '1', email: 'updated@test.com' };
        (userController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUpdated);
        });

        await request(app)
            .put('/1')
            .send({ email: 'updated@test.com' })
            .expect(200)
            .expect(mockUpdated);
    });

    it('DELETE /:id - should delete user', async () => {
        (userController.delete as jest.Mock).mockImplementation((req, res) => {
            res.status(204).send();
        });

        await request(app)
            .delete('/1')
            .expect(204);
    });

    // Error test cases
    it('POST /login - should handle invalid credentials', async () => {
        (userController.login as jest.Mock).mockImplementation((req, res) => {
            res.status(401).json({ message: 'Invalid credentials' });
        });

        await request(app)
            .post('/login')
            .send({ email: 'wrong@test.com', password: 'wrongpass' })
            .expect(401)
            .expect({ message: 'Invalid credentials' });
    });

    it('POST / - should handle duplicate email', async () => {
        (userController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(409).json({ message: 'Email already exists' });
        });

        await request(app)
            .post('/')
            .send({ email: 'existing@test.com', password: 'password' })
            .expect(409)
            .expect({ message: 'Email already exists' });
    });

    it('GET /:id - should handle user not found', async () => {
        (userController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(404).json({ message: 'User not found' });
        });

        await request(app)
            .get('/999')
            .expect(404)
            .expect({ message: 'User not found' });
    });

    it('PUT /:id - should handle validation errors', async () => {
        (userController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ message: 'Invalid email format' });
        });

        await request(app)
            .put('/1')
            .send({ email: 'invalid-email' })
            .expect(400)
            .expect({ message: 'Invalid email format' });
    });
});
