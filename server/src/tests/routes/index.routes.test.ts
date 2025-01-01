import request from 'supertest';
import express from 'express';
import indexRoutes from '../../routes/index.routes';
import { certificateController } from '../../controllers/certificate.controller';

jest.mock('../../controllers/certificate.controller');

const app = express();
app.use(express.json());
app.use('/', indexRoutes);

describe('Index Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // GET endpoints
    describe('GET Endpoints', () => {
        describe('GET /alive', () => {
            it('should return health status', async () => {
                const response = await request(app)
                    .get('/alive')
                    .expect(200);

                expect(response.body).toHaveProperty('status', 'alive');
                expect(response.body).toHaveProperty('timestamp');
                expect(Date.parse(response.body.timestamp)).not.toBeNaN();
            });
        });

        describe('GET /check-certificate', () => {
            it('should check certificate', async () => {
                const mockInfo = { domain: 'test.com', validTo: '2024-01-01' };
                (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
                    res.status(200).json(mockInfo);
                });

                await request(app)
                    .get('/check-certificate?url=https://test.com')
                    .expect(200)
                    .expect(mockInfo);
            });

            it('should handle invalid URL', async () => {
                (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
                    res.status(400).json({ message: 'Invalid URL format' });
                });

                await request(app)
                    .get('/check-certificate?url=invalid-url')
                    .expect(400)
                    .expect({ message: 'Invalid URL format' });
            });

            it('should handle unreachable domain', async () => {
                (certificateController.checkCertificate as jest.Mock).mockImplementation((req, res) => {
                    res.status(503).json({ message: 'Unable to reach domain' });
                });

                await request(app)
                    .get('/check-certificate?url=https://nonexistent.domain')
                    .expect(503)
                    .expect({ message: 'Unable to reach domain' });
            });
        });
    });
});
