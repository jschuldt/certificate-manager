import request from 'supertest';
import express from 'express';
import apiRoutes from '../../routes/api.routes';
import { certificateController } from '../../controllers/certificate.controller';
import { userService } from '../../services/user.service';
import * as certificateUtils from '../../utils/certificate.utils';
import * as mapperUtils from '../../utils/mapper.utils';

// Mock setup
jest.mock('../../controllers/certificate.controller');
jest.mock('../../services/user.service');
jest.mock('../../utils/certificate.utils');
jest.mock('../../utils/mapper.utils');

const app = express();
app.use(express.json());
app.use('/', apiRoutes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Health Check Tests
  describe('Health Check Endpoints', () => {
    describe('GET /alive', () => {
      it('should return alive status with timestamp', async () => {
        const response = await request(app)
          .get('/alive')
          .expect(200);

        expect(response.body).toHaveProperty('status', 'alive');
        expect(response.body).toHaveProperty('timestamp');
        expect(Date.parse(response.body.timestamp)).not.toBeNaN();
      });
    });
  });

  // Certificate Management Tests
  describe('Certificate Management', () => {
    describe('Certificate Validation', () => {
      describe('GET /check-certificate', () => {
        it('should check certificate successfully', async () => {
          const mockCertInfo = {
            subject: 'example.com',
            issuer: 'Test CA',
            validFrom: '2023-01-01',
            validTo: '2024-01-01'
          };

          const mockMappedCertificate = {
            domain: 'example.com',
            issuer: 'Test CA',
            expiryDate: '2024-01-01'
          };

          (certificateUtils.getCertificateInfo as jest.Mock).mockResolvedValue(mockCertInfo);
          (mapperUtils.mapCertificateInfoToModel as jest.Mock).mockReturnValue(mockMappedCertificate);

          const response = await request(app)
            .get('/check-certificate?url=https://example.com')
            .expect(200);

          expect(response.body).toEqual(mockMappedCertificate);
          expect(certificateUtils.getCertificateInfo).toHaveBeenCalledWith('https://example.com');
          expect(mapperUtils.mapCertificateInfoToModel).toHaveBeenCalledWith(mockCertInfo);
        });

        it('should handle missing URL parameter', async () => {
          const response = await request(app)
            .get('/check-certificate')
            .expect(400);

          expect(response.body).toHaveProperty('error', 'URL parameter is required');
        });

        it('should handle invalid URL parameter', async () => {
          const response = await request(app)
            .get('/check-certificate?url=')
            .expect(400);

          expect(response.body).toHaveProperty('error', 'URL parameter is required');
        });

        it('should handle certificate fetch errors', async () => {
          (certificateUtils.getCertificateInfo as jest.Mock).mockRejectedValue(
            new Error('Failed to fetch certificate')
          );

          const response = await request(app)
            .get('/check-certificate?url=https://invalid.com')
            .expect(500);

          expect(response.body).toHaveProperty('error', 'Failed to fetch certificate info');
          expect(response.body).toHaveProperty('details', 'Failed to fetch certificate');
        });
      });
    });

    describe('Certificate CRUD Operations', () => {
      describe('POST /certificates', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should create a certificate successfully', async () => {
          const mockCertificate = {
            domain: 'example.com',
            expiryDate: '2024-12-31',
            issuer: 'Test CA'
          };

          (certificateController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json(mockCertificate);
          });

          const response = await request(app)
            .post('/certificates')
            .send(mockCertificate)
            .expect(201);

          expect(response.body).toEqual(mockCertificate);
          expect(certificateController.create).toHaveBeenCalled();
        });

        it('should handle validation errors', async () => {
          const invalidCertificate = {
            domain: '',
            expiryDate: 'invalid-date'
          };

          (certificateController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ error: 'Invalid certificate data' });
          });

          const response = await request(app)
            .post('/certificates')
            .send(invalidCertificate)
            .expect(400);

          expect(response.body).toHaveProperty('error');
          expect(certificateController.create).toHaveBeenCalled();
        });
      });

      describe('GET /certificates', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should retrieve all certificates successfully', async () => {
          const mockCertificates = [
            {
              id: '1',
              domain: 'example.com',
              expiryDate: '2024-12-31',
              issuer: 'Test CA'
            },
            {
              id: '2',
              domain: 'test.com',
              expiryDate: '2024-11-30',
              issuer: 'Another CA'
            }
          ];

          (certificateController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockCertificates);
          });

          const response = await request(app)
            .get('/certificates')
            .expect(200);

          expect(response.body).toEqual(mockCertificates);
          expect(response.body).toHaveLength(2);
          expect(certificateController.getAll).toHaveBeenCalled();
        });

        it('should handle errors when retrieving certificates', async () => {
          (certificateController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(500).json({ error: 'Failed to fetch certificates' });
          });

          const response = await request(app)
            .get('/certificates')
            .expect(500);

          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toBe('Failed to fetch certificates');
          expect(certificateController.getAll).toHaveBeenCalled();
        });

        it('should handle pagination parameters', async () => {
          const mockPaginatedResponse = {
            certificates: [
              {
                id: '1',
                domain: 'example.com',
                expiryDate: '2024-12-31',
                issuer: 'Test CA'
              }
            ],
            page: 1,
            limit: 10,
            total: 1
          };

          (certificateController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockPaginatedResponse);
          });

          const response = await request(app)
            .get('/certificates?page=1&limit=10')
            .expect(200);

          expect(response.body).toEqual(mockPaginatedResponse);
          expect(certificateController.getAll).toHaveBeenCalled();
        });
      });

      describe('GET /certificates/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should retrieve a specific certificate successfully', async () => {
          const mockCertificate = {
            id: '123',
            domain: 'example.com',
            expiryDate: '2024-12-31',
            issuer: 'Test CA'
          };

          (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockCertificate);
          });

          const response = await request(app)
            .get('/certificates/123')
            .expect(200);

          expect(response.body).toEqual(mockCertificate);
          expect(certificateController.getById).toHaveBeenCalled();
        });

        it('should return 404 when certificate is not found', async () => {
          (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(404).json({ error: 'Certificate not found' });
          });

          const response = await request(app)
            .get('/certificates/nonexistent')
            .expect(404);

          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toBe('Certificate not found');
          expect(certificateController.getById).toHaveBeenCalled();
        });

        it('should handle server errors when retrieving certificate', async () => {
          (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(500).json({ error: 'Internal server error' });
          });

          const response = await request(app)
            .get('/certificates/123')
            .expect(500);

          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toBe('Internal server error');
          expect(certificateController.getById).toHaveBeenCalled();
        });
      });

      describe('PUT /certificates/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should update a certificate successfully', async () => {
          const mockUpdatedCertificate = {
            id: '123',
            domain: 'updated.com',
            expiryDate: '2025-12-31',
            issuer: 'Updated CA'
          };

          (certificateController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUpdatedCertificate);
          });

          const response = await request(app)
            .put('/certificates/123')
            .send(mockUpdatedCertificate)
            .expect(200);

          expect(response.body).toEqual(mockUpdatedCertificate);
          expect(certificateController.update).toHaveBeenCalled();
        });

        it('should handle 404 when updating non-existent certificate', async () => {
          (certificateController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(404).json({ error: 'Certificate not found' });
          });

          const response = await request(app)
            .put('/certificates/nonexistent')
            .send({ domain: 'test.com' })
            .expect(404);

          expect(response.body.error).toBe('Certificate not found');
        });
      });

      describe('DELETE /certificates/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should delete a certificate successfully', async () => {
          (certificateController.delete as jest.Mock).mockImplementation((req, res) => {
            res.status(204).send();
          });

          await request(app)
            .delete('/certificates/123')
            .expect(204);

          expect(certificateController.delete).toHaveBeenCalled();
        });

        it('should handle 404 when deleting non-existent certificate', async () => {
          (certificateController.delete as jest.Mock).mockImplementation((req, res) => {
            res.status(404).json({ error: 'Certificate not found' });
          });

          const response = await request(app)
            .delete('/certificates/nonexistent')
            .expect(404);

          expect(response.body.error).toBe('Certificate not found');
        });
      });
    });

    describe('Certificate Advanced Operations', () => {
      describe('GET /certificates/search', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should search certificates successfully', async () => {
          const mockSearchResults = [
            { id: '1', domain: 'test.com', expiryDate: '2024-12-31', issuer: 'Test CA' }
          ];

          (certificateController.search as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockSearchResults);
          });

          const response = await request(app)
            .get('/certificates/search?query=test')
            .expect(200);

          expect(response.body).toEqual(mockSearchResults);
          expect(certificateController.search).toHaveBeenCalled();
        });
      });

      describe('GET /certificates/expiring/:days', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should get expiring certificates successfully', async () => {
          const mockExpiringCerts = [
            { id: '1', domain: 'expiring.com', expiryDate: '2024-01-01', issuer: 'Test CA' }
          ];

          (certificateController.getExpiring as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockExpiringCerts);
          });

          const response = await request(app)
            .get('/certificates/expiring/30')
            .expect(200);

          expect(response.body).toEqual(mockExpiringCerts);
          expect(certificateController.getExpiring).toHaveBeenCalled();
        });
      });

      describe('POST /certificates/bulk', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should create multiple certificates successfully', async () => {
          const mockBulkCertificates = [
            { domain: 'bulk1.com', expiryDate: '2024-12-31', issuer: 'Bulk CA' },
            { domain: 'bulk2.com', expiryDate: '2024-12-31', issuer: 'Bulk CA' }
          ];

          (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json({ created: mockBulkCertificates });
          });

          const response = await request(app)
            .post('/certificates/bulk')
            .send(mockBulkCertificates)
            .expect(201);

          expect(response.body.created).toEqual(mockBulkCertificates);
          expect(certificateController.bulkCreate).toHaveBeenCalled();
        });

        it('should handle validation errors in bulk create', async () => {
          const invalidBulkData = [
            { domain: '', expiryDate: 'invalid-date' }
          ];

          (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ error: 'Invalid certificate data in bulk create' });
          });

          const response = await request(app)
            .post('/certificates/bulk')
            .send(invalidBulkData)
            .expect(400);

          expect(response.body).toHaveProperty('error');
          expect(certificateController.bulkCreate).toHaveBeenCalled();
        });
      });
    });
  });

  // User Management Tests
  describe('User Management', () => {
    describe('Authentication', () => {
      describe('POST /users/login', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should login user successfully', async () => {
          const mockUser = {
            id: '1',
            email: 'test@example.com',
            name: 'Test User'
          };

          (userService.login as jest.Mock).mockResolvedValue({
            toObject: () => ({ ...mockUser, password: 'hashedpass' })
          });

          const response = await request(app)
            .post('/users/login')
            .send({ email: 'test@example.com', password: 'password123' })
            .expect(200);

          expect(response.body).toEqual(mockUser);
          expect(response.body).not.toHaveProperty('password');
        });

        it('should handle invalid credentials', async () => {
          (userService.login as jest.Mock).mockResolvedValue(null);

          const response = await request(app)
            .post('/users/login')
            .send({ email: 'wrong@example.com', password: 'wrongpass' })
            .expect(401);

          expect(response.body.error).toBe('Invalid credentials');
        });

        it('should handle missing credentials', async () => {
          const response = await request(app)
            .post('/users/login')
            .send({})
            .expect(400);

          expect(response.body.error).toBe('Email and password are required');
        });
      });
    });

    describe('User CRUD Operations', () => {
      describe('POST /users', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should create user successfully', async () => {
          const mockUser = {
            id: '1',
            email: 'new@example.com',
            name: 'New User'
          };

          (userService.create as jest.Mock).mockResolvedValue(mockUser);

          const response = await request(app)
            .post('/users')
            .send({ email: 'new@example.com', name: 'New User', password: 'password123' })
            .expect(201);

          expect(response.body).toEqual(mockUser);
        });

        it('should handle validation errors', async () => {
          (userService.create as jest.Mock).mockRejectedValue(new Error('Validation failed'));

          const response = await request(app)
            .post('/users')
            .send({ email: 'invalid' })
            .expect(400);

          expect(response.body.error).toBe('Failed to create user');
        });

        it('should not return password in response when creating user', async () => {
          const mockUser = {
            id: '1',
            email: 'new@example.com',
            name: 'New User',
            password: 'hashedpassword123'
          };

          (userService.create as jest.Mock).mockResolvedValue(mockUser);

          const response = await request(app)
            .post('/users')
            .send({ email: 'new@example.com', name: 'New User', password: 'password123' })
            .expect(201);

          expect(response.body).not.toHaveProperty('password');
          expect(response.body).toEqual({
            id: '1',
            email: 'new@example.com',
            name: 'New User'
          });
        });
      });

      describe('GET /users', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should get all users with pagination', async () => {
          const mockUsers = {
            users: [
              { id: '1', name: 'User 1', email: 'user1@example.com' },
              { id: '2', name: 'User 2', email: 'user2@example.com' }
            ],
            total: 2,
            page: 1,
            limit: 10
          };

          (userService.getAll as jest.Mock).mockResolvedValue(mockUsers);

          const response = await request(app)
            .get('/users?page=1&limit=10')
            .expect(200);

          expect(response.body).toEqual(mockUsers);
          expect(userService.getAll).toHaveBeenCalledWith(1, 10);
        });

        it('should handle errors when fetching users', async () => {
          (userService.getAll as jest.Mock).mockRejectedValue(new Error('Database error'));

          const response = await request(app)
            .get('/users')
            .expect(500);

          expect(response.body.error).toBe('Failed to fetch users');
        });

        it('should not return password in users list', async () => {
          const mockUsersWithPasswords = {
            users: [
              { id: '1', name: 'User 1', email: 'user1@example.com', password: 'hash1' },
              { id: '2', name: 'User 2', email: 'user2@example.com', password: 'hash2' }
            ],
            total: 2,
            page: 1,
            limit: 10
          };

          (userService.getAll as jest.Mock).mockResolvedValue(mockUsersWithPasswords);

          const response = await request(app)
            .get('/users')
            .expect(200);

          expect(response.body.users).toHaveLength(2);
          response.body.users.forEach((user: { id: string; name: string; email: string }) => {
            expect(user).not.toHaveProperty('password');
          });
        });
      });

      describe('GET /users/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should get user by id successfully', async () => {
          const mockUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com'
          };

          (userService.getById as jest.Mock).mockResolvedValue(mockUser);

          const response = await request(app)
            .get('/users/123')
            .expect(200);

          expect(response.body).toEqual(mockUser);
        });

        it('should handle non-existent user', async () => {
          (userService.getById as jest.Mock).mockResolvedValue(null);

          const response = await request(app)
            .get('/users/nonexistent')
            .expect(404);

          expect(response.body.error).toBe('User not found');
        });

        it('should not return password when getting user by id', async () => {
          const mockUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedpassword123'
          };

          (userService.getById as jest.Mock).mockResolvedValue(mockUser);

          const response = await request(app)
            .get('/users/123')
            .expect(200);

          expect(response.body).not.toHaveProperty('password');
          expect(response.body).toEqual({
            id: '123',
            name: 'Test User',
            email: 'test@example.com'
          });
        });
      });

      describe('PUT /users/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should update user successfully', async () => {
          const mockUpdatedUser = {
            id: '123',
            name: 'Updated Name',
            email: 'updated@example.com'
          };

          (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

          const response = await request(app)
            .put('/users/123')
            .send({ name: 'Updated Name' })
            .expect(200);

          expect(response.body).toEqual(mockUpdatedUser);
        });

        it('should handle non-existent user update', async () => {
          (userService.update as jest.Mock).mockResolvedValue(null);

          const response = await request(app)
            .put('/users/nonexistent')
            .send({ name: 'New Name' })
            .expect(404);

          expect(response.body.error).toBe('User not found');
        });

        it('should not return password in response when updating user', async () => {
          const mockUpdatedUser = {
            id: '123',
            name: 'Updated Name',
            email: 'updated@example.com',
            password: 'hashedpassword123'
          };

          (userService.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

          const response = await request(app)
            .put('/users/123')
            .send({ name: 'Updated Name' })
            .expect(200);

          expect(response.body).not.toHaveProperty('password');
          expect(response.body).toEqual({
            id: '123',
            name: 'Updated Name',
            email: 'updated@example.com'
          });
        });
      });

      describe('DELETE /users/:id', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should delete user successfully', async () => {
          (userService.delete as jest.Mock).mockResolvedValue(true);

          await request(app)
            .delete('/users/123')
            .expect(204);
        });

        it('should handle non-existent user deletion', async () => {
          (userService.delete as jest.Mock).mockResolvedValue(false);

          const response = await request(app)
            .delete('/users/nonexistent')
            .expect(404);

          expect(response.body.error).toBe('User not found');
        });
      });
    });

    describe('User Search Operations', () => {
      describe('GET /users/search', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should search users successfully', async () => {
          const mockSearchResults = [
            { id: '1', name: 'Test User', email: 'test@example.com' }
          ];

          (userService.search as jest.Mock).mockResolvedValue(mockSearchResults);

          const response = await request(app)
            .get('/users/search?firstName=Test&email=test@example.com')
            .expect(200);

          expect(response.body).toEqual(mockSearchResults);
          expect(userService.search).toHaveBeenCalledWith({
            firstName: 'Test',
            email: 'test@example.com'
          });
        });

        it('should handle empty search results', async () => {
          (userService.search as jest.Mock).mockResolvedValue([]);

          const response = await request(app)
            .get('/users/search?query=nonexistent')
            .expect(200);

          expect(response.body).toEqual([]);
          expect(userService.search).toHaveBeenCalledWith({
            query: 'nonexistent'
          });
        });

        it('should handle search with multiple parameters', async () => {
          const mockSearchResults = [
            { id: '1', name: 'Test User', email: 'test@example.com' }
          ];

          (userService.search as jest.Mock).mockResolvedValue(mockSearchResults);

          const response = await request(app)
            .get('/users/search?firstName=Test&lastName=User&email=test@example.com')
            .expect(200);

          expect(response.body).toEqual(mockSearchResults);
          expect(userService.search).toHaveBeenCalledWith({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com'
          });
        });
      });
    });
  });
});