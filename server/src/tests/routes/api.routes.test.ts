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
});