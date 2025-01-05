import request from 'supertest';
import express from 'express';
import systemRoutes from '../../routes/system.routes';

const app = express();
app.use(express.json());
app.use('/', systemRoutes);

/**
 * Test suite for system-related endpoints
 */
describe('System Routes', () => {
    describe('GET Endpoints', () => {
        /**
         * Health check endpoint tests
         * Verifies application status reporting
         */
        describe('GET /system/alive', () => {
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
