import request from 'supertest';
import express from 'express';
import certificateRoutes from '../../routes/certificate.routes';
import { certificateController } from '../../controllers/certificate.controller';

jest.mock('../../controllers/certificate.controller');

const app = express();
app.use(express.json());
app.use('/', certificateRoutes);

describe('Certificate Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Testing routes in order they appear in certificate.routes.ts
    it('POST / - should create certificate', async () => {
        const mockCertificate = { domain: 'test.com', expiryDate: '2024-01-01' };
        (certificateController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json(mockCertificate);
        });

        await request(app)
            .post('/')
            .send(mockCertificate)
            .expect(201)
            .expect(mockCertificate);
    });

    it('GET / - should get all certificates', async () => {
        const mockCertificates = [{ id: '1', domain: 'test.com' }];
        (certificateController.getAll as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockCertificates);
        });

        await request(app)
            .get('/')
            .expect(200)
            .expect(mockCertificates);
    });

    it('GET /search - should search certificates', async () => {
        const mockResults = [{ id: '1', domain: 'test.com' }];
        (certificateController.search as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockResults);
        });

        await request(app)
            .get('/search?query=test')
            .expect(200)
            .expect(mockResults);
    });

    it('GET /expiring/:days - should get expiring certificates', async () => {
        const mockExpiring = [{ id: '1', domain: 'test.com' }];
        (certificateController.getExpiring as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockExpiring);
        });

        await request(app)
            .get('/expiring/30')
            .expect(200)
            .expect(mockExpiring);
    });

    it('GET /:id - should get certificate by id', async () => {
        const mockCertificate = { id: '1', domain: 'test.com' };
        (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockCertificate);
        });

        await request(app)
            .get('/1')
            .expect(200)
            .expect(mockCertificate);
    });

    it('PUT /:id - should update certificate', async () => {
        const mockUpdated = { id: '1', domain: 'updated.com' };
        (certificateController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(200).json(mockUpdated);
        });

        await request(app)
            .put('/1')
            .send({ domain: 'updated.com' })
            .expect(200)
            .expect(mockUpdated);
    });

    it('DELETE /:id - should delete certificate', async () => {
        (certificateController.delete as jest.Mock).mockImplementation((req, res) => {
            res.status(204).send();
        });

        await request(app)
            .delete('/1')
            .expect(204);
    });

    it('POST /bulk - should create multiple certificates', async () => {
        const mockCertificates = [
            { domain: 'test1.com' },
            { domain: 'test2.com' }
        ];
        (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
            res.status(201).json(mockCertificates);
        });

        await request(app)
            .post('/bulk')
            .send(mockCertificates)
            .expect(201)
            .expect(mockCertificates);
    });

    // Error test cases
    it('POST / - should handle invalid certificate data', async () => {
        (certificateController.create as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ message: 'Invalid certificate data' });
        });

        await request(app)
            .post('/')
            .send({ domain: '' })
            .expect(400)
            .expect({ message: 'Invalid certificate data' });
    });

    it('GET /:id - should handle certificate not found', async () => {
        (certificateController.getById as jest.Mock).mockImplementation((req, res) => {
            res.status(404).json({ message: 'Certificate not found' });
        });

        await request(app)
            .get('/999')
            .expect(404)
            .expect({ message: 'Certificate not found' });
    });

    it('PUT /:id - should handle validation errors', async () => {
        (certificateController.update as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ message: 'Invalid domain format' });
        });

        await request(app)
            .put('/1')
            .send({ domain: '' })
            .expect(400)
            .expect({ message: 'Invalid domain format' });
    });

    it('POST /bulk - should handle invalid bulk data', async () => {
        (certificateController.bulkCreate as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ message: 'Invalid bulk certificate data' });
        });

        await request(app)
            .post('/bulk')
            .send([{ domain: '' }, { domain: null }])
            .expect(400)
            .expect({ message: 'Invalid bulk certificate data' });
    });

    it('GET /expiring/:days - should handle invalid days parameter', async () => {
        (certificateController.getExpiring as jest.Mock).mockImplementation((req, res) => {
            res.status(400).json({ message: 'Invalid days parameter' });
        });

        await request(app)
            .get('/expiring/-1')
            .expect(400)
            .expect({ message: 'Invalid days parameter' });
    });
});