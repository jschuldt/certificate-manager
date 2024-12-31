import request from 'supertest';
import express from 'express';
import apiRoutes from '../../routes/api.routes';
import { certificateController } from '../../controllers/certificate.controller';

// Mock the certificate controller
jest.mock('../../controllers/certificate.controller');

const app = express();
app.use(express.json());
app.use('/', apiRoutes);

describe('API Routes', () => {
  it('should be defined', () => {
    expect(apiRoutes).toBeDefined();
  });

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