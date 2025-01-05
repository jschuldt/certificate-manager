import request from 'supertest';
import express from 'express';
import indexRoutes from '../../routes/index.routes';

const app = express();
app.use(express.json());
app.use('/', indexRoutes);

/**
 * Test suite for core application endpoints
 */
describe('Index Routes', () => {
    describe('GET Endpoints', () => {
        /**
         * Health check endpoint tests
         * Verifies application status reporting
         */
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
    });
});
