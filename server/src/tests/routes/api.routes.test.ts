import request from 'supertest';
import express from 'express';
import apiRoutes from '../../routes/api.routes';
import { certificateController } from '../../controllers/certificate.controller';
import { userController } from '../../controllers/user.controller';

// Mock controllers
jest.mock('../../controllers/certificate.controller');
jest.mock('../../controllers/user.controller');

const app = express();
app.use(express.json());
app.use('/', apiRoutes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check', () => {
    it('GET /alive - should return alive status with timestamp', async () => {
      const response = await request(app)
        .get('/alive')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'alive');
      expect(response.body).toHaveProperty('timestamp');
      expect(Date.parse(response.body.timestamp)).not.toBeNaN();
    });
  });

  describe('Certificate Routes', () => {
    describe('POST /certificates', () => {
      it('should create a certificate', async () => {
        const mockCertificate = { domain: 'test.com', expiryDate: '2024-01-01' };
        (certificateController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(201).json(mockCertificate);
        });

        await request(app)
          .post('/certificates')
          .send(mockCertificate)
          .expect(201)
          .expect(mockCertificate);
      });

      it('should handle invalid certificate data', async () => {
        const invalidData = { domain: '', expiryDate: 'invalid-date' };
        (certificateController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({ error: 'Invalid certificate data' });
        });

        await request(app)
          .post('/certificates')
          .send(invalidData)
          .expect(400)
          .expect({ error: 'Invalid certificate data' });
      });

      it('should handle duplicate domain', async () => {
        const duplicateData = { domain: 'existing.com', expiryDate: '2024-01-01' };
        (certificateController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(409).json({ error: 'Certificate for this domain already exists' });
        });

        await request(app)
          .post('/certificates')
          .send(duplicateData)
          .expect(409)
          .expect({ error: 'Certificate for this domain already exists' });
      });
    });

    describe('GET /certificates', () => {
      it('should get all certificates', async () => {
        const mockCertificates = [{ id: '1', domain: 'test.com' }];
        (certificateController.getAll as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockCertificates);
        });

        await request(app)
          .get('/certificates')
          .expect(200)
          .expect(mockCertificates);
      });
    });

    describe('GET /certificates/search', () => {
      it('should search certificates', async () => {
        const mockResults = [{ id: '1', domain: 'test.com' }];
        (certificateController.search as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockResults);
        });

        await request(app)
          .get('/certificates/search?query=test')
          .expect(200)
          .expect(mockResults);
      });
    });

    describe('GET /certificates/expiring/:days', () => {
      it('should get expiring certificates', async () => {
        const mockExpiring = [{ id: '1', domain: 'test.com', expiryDate: '2024-01-01' }];
        (certificateController.getExpiring as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockExpiring);
        });

        await request(app)
          .get('/certificates/expiring/30')
          .expect(200)
          .expect(mockExpiring);
      });
    });

    describe('GET /certificates/:id', () => {
      it('should get certificate by id', async () => {
        const mockCertificate = { id: '1', domain: 'test.com' };
        (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockCertificate);
        });

        await request(app)
          .get('/certificates/1')
          .expect(200)
          .expect(mockCertificate);
      });
    });

    describe('PUT /certificates/:id', () => {
      it('should update certificate', async () => {
        const mockUpdated = { id: '1', domain: 'updated.com' };
        (certificateController.update as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockUpdated);
        });

        await request(app)
          .put('/certificates/1')
          .send({ domain: 'updated.com' })
          .expect(200)
          .expect(mockUpdated);
      });
    });

    describe('DELETE /certificates/:id', () => {
      it('should delete certificate', async () => {
        (certificateController.delete as jest.Mock).mockImplementation((req, res) => {
          res.status(204).send();
        });

        await request(app)
          .delete('/certificates/1')
          .expect(204);
      });
    });

    describe('POST /certificates/bulk', () => {
      it('should create multiple certificates', async () => {
        const mockCertificates = [
          { domain: 'test1.com' },
          { domain: 'test2.com' }
        ];
        (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
          res.status(201).json(mockCertificates);
        });

        await request(app)
          .post('/certificates/bulk')
          .send(mockCertificates)
          .expect(201)
          .expect(mockCertificates);
      });

      it('should handle invalid certificates in bulk create', async () => {
        const invalidData = [
          { domain: '' },
          { domain: 'test.com', expiryDate: 'invalid' }
        ];

        (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({
            error: 'Validation failed',
            failures: [
              { index: 0, error: 'Domain is required' },
              { index: 1, error: 'Invalid expiry date' }
            ]
          });
        });

        await request(app)
          .post('/certificates/bulk')
          .send(invalidData)
          .expect(400)
          .expect({
            error: 'Validation failed',
            failures: [
              { index: 0, error: 'Domain is required' },
              { index: 1, error: 'Invalid expiry date' }
            ]
          });
      });
    });

    describe('GET /check-certificate', () => {
      it('should check certificate info', async () => {
        const mockInfo = { domain: 'test.com', validTo: '2024-01-01' };
        (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockInfo);
        });

        await request(app)
          .get('/check-certificate?url=https://test.com')
          .expect(200)
          .expect(mockInfo);
      });

      it('should handle invalid URL format', async () => {
        (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({ error: 'Invalid URL format' });
        });

        await request(app)
          .get('/check-certificate?url=invalid-url')
          .expect(400)
          .expect({ error: 'Invalid URL format' });
      });

      it('should handle unreachable host', async () => {
        (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
          res.status(500).json({ error: 'Unable to reach host' });
        });

        await request(app)
          .get('/check-certificate?url=https://nonexistent.example.com')
          .expect(500)
          .expect({ error: 'Unable to reach host' });
      });
    });
  });

  describe('User Routes', () => {
    describe('POST /users/login', () => {
      it('should login user', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.login as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockUser);
        });

        await request(app)
          .post('/users/login')
          .send({ email: 'test@test.com', password: 'password' })
          .expect(200)
          .expect(mockUser);
      });

      it('should handle invalid credentials', async () => {
        (userController.login as jest.Mock).mockImplementation((req, res) => {
          res.status(401).json({ error: 'Invalid email or password' });
        });

        await request(app)
          .post('/users/login')
          .send({ email: 'wrong@test.com', password: 'wrongpass' })
          .expect(401)
          .expect({ error: 'Invalid email or password' });
      });

      it('should handle missing credentials', async () => {
        (userController.login as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({ error: 'Email and password are required' });
        });

        await request(app)
          .post('/users/login')
          .send({})
          .expect(400)
          .expect({ error: 'Email and password are required' });
      });
    });

    describe('POST /users', () => {
      it('should create user', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(201).json(mockUser);
        });

        await request(app)
          .post('/users')
          .send({ email: 'test@test.com', password: 'password' })
          .expect(201)
          .expect(mockUser);
      });

      it('should handle existing email', async () => {
        (userController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(409).json({ error: 'Email already registered' });
        });

        await request(app)
          .post('/users')
          .send({ email: 'existing@test.com', password: 'password' })
          .expect(409)
          .expect({ error: 'Email already registered' });
      });

      it('should handle invalid user data', async () => {
        (userController.create as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({ error: 'Invalid email format' });
        });

        await request(app)
          .post('/users')
          .send({ email: 'invalid-email', password: '123' })
          .expect(400)
          .expect({ error: 'Invalid email format' });
      });
    });

    describe('GET /users', () => {
      it('should get all users', async () => {
        const mockUsers = [{ id: '1', email: 'test@test.com' }];
        (userController.getAll as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockUsers);
        });

        await request(app)
          .get('/users')
          .expect(200)
          .expect(mockUsers);
      });
    });

    describe('GET /users/search', () => {
      it('should search users', async () => {
        const mockResults = [{ id: '1', email: 'test@test.com' }];
        (userController.search as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockResults);
        });

        await request(app)
          .get('/users/search?query=test')
          .expect(200)
          .expect(mockResults);
      });
    });

    describe('GET /users/:id', () => {
      it('should get user by id', async () => {
        const mockUser = { id: '1', email: 'test@test.com' };
        (userController.getById as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockUser);
        });

        await request(app)
          .get('/users/1')
          .expect(200)
          .expect(mockUser);
      });

      it('should handle non-existent user', async () => {
        (userController.getById as jest.Mock).mockImplementation((req, res) => {
          res.status(404).json({ error: 'User not found' });
        });

        await request(app)
          .get('/users/999')
          .expect(404)
          .expect({ error: 'User not found' });
      });
    });

    describe('PUT /users/:id', () => {
      it('should update user', async () => {
        const mockUpdated = { id: '1', email: 'updated@test.com' };
        (userController.update as jest.Mock).mockImplementation((req, res) => {
          res.status(200).json(mockUpdated);
        });

        await request(app)
          .put('/users/1')
          .send({ email: 'updated@test.com' })
          .expect(200)
          .expect(mockUpdated);
      });

      it('should handle invalid password update', async () => {
        (userController.update as jest.Mock).mockImplementation((req, res) => {
          res.status(400).json({ error: 'Password must be at least 8 characters' });
        });

        await request(app)
          .put('/users/1')
          .send({ password: '123' })
          .expect(400)
          .expect({ error: 'Password must be at least 8 characters' });
      });
    });

    describe('DELETE /users/:id', () => {
      it('should delete user', async () => {
        (userController.delete as jest.Mock).mockImplementation((req, res) => {
          res.status(204).send();
        });

        await request(app)
          .delete('/users/1')
          .expect(204);
      });
    });
  });
});