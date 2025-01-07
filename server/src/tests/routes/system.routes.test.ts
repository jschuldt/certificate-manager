import request from 'supertest';
import express from 'express';
import systemRoutes from '../../routes/system.routes';
import { systemController } from '../../controllers/system.controller';

// Mock the system controller
jest.mock('../../controllers/system.controller');

// Increase global timeout
jest.setTimeout(10000);

const app = express();
app.use(express.json());
app.use('/', systemRoutes);

describe('System Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock implementation for health check
        (systemController.healthCheck as jest.Mock).mockImplementation((req, res) => {
            res.json({ status: 'alive', timestamp: new Date().toISOString() });
        });
    });

    describe('GET Endpoints', () => {
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

    describe('POST /email', () => {
        const validEmailPayload = {
            to: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test Message'
        };

        beforeEach(() => {
            // Setup default mock implementation for email endpoint
            (systemController.sendEmail as jest.Mock).mockImplementation((req, res) => {
                const { to, subject, message } = req.body;
                if (!to || !subject || !message) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
                    return res.status(400).json({ error: 'Invalid email format' });
                }
                res.status(200).json({ success: true, message: 'Email sent successfully' });
            });
        });

        it('should successfully send email with valid payload', async () => {
            const response = await request(app)
                .post('/email')
                .send(validEmailPayload);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Email sent successfully'
            });
        });

        it('should return 400 when email address is invalid', async () => {
            const invalidPayload = {
                ...validEmailPayload,
                to: 'invalid-email'
            };

            const response = await request(app)
                .post('/email')
                .send(invalidPayload)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Invalid email format');
        });

        it('should return 400 when required fields are missing', async () => {
            const incompletePayload = {
                to: 'test@example.com',
                // Missing subject and message
            };

            const response = await request(app)
                .post('/email')
                .send(incompletePayload)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Missing required fields');
        });

        it('should return 500 when email service fails', async () => {
            // Mock email service failure
            (systemController.sendEmail as jest.Mock).mockImplementation((req, res) => {
                res.status(500).json({
                    error: 'Failed to send email',
                    details: 'SMTP configuration error'
                });
            });

            const response = await request(app)
                .post('/email')
                .send(validEmailPayload)
                .expect(500);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Failed to send email');
        });

        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/email')
                .send({})
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Missing required fields');
        });
    });

    describe('PUT /smtp', () => {
        const validSmtpPayload = {
            service: 'GMAIL',
            host: 'smtp.gmail.com',
            port: 587,
            secure: true,
            auth: {
                user: 'test@gmail.com',
                pass: 'testpassword123'
            },
            fromAddress: 'test@gmail.com',
            isDefault: true
        };

        beforeEach(() => {
            // Setup default mock implementation for SMTP settings endpoint
            (systemController.updateSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                const { service, host, port, auth, fromAddress } = req.body;
                
                if (!service || !host || !port || !auth || !fromAddress) {
                    return res.status(400).json({ 
                        error: 'Missing required fields' 
                    });
                }

                if (!auth.user || !auth.pass) {
                    return res.status(400).json({ 
                        error: 'Authentication credentials required' 
                    });
                }

                // Return success with sanitized config (no password)
                res.status(200).json({
                    success: true,
                    message: 'SMTP settings updated successfully',
                    config: {
                        ...req.body,
                        auth: {
                            user: auth.user
                        }
                    }
                });
            });
        });

        it('should successfully update SMTP settings with valid payload', async () => {
            const response = await request(app)
                .put('/smtp')
                .send(validSmtpPayload)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.config).toBeDefined();
            expect(response.body.config.auth.pass).toBeUndefined();
            expect(response.body.config.auth.user).toBe(validSmtpPayload.auth.user);
        });

        it('should return 400 when required fields are missing', async () => {
            const invalidPayload = {
                service: 'GMAIL',
                // Missing other required fields
            };

            const response = await request(app)
                .put('/smtp')
                .send(invalidPayload)
                .expect(400);

            expect(response.body.error).toBe('Missing required fields');
        });

        it('should return 400 when auth credentials are missing', async () => {
            const invalidPayload = {
                ...validSmtpPayload,
                auth: {} // Missing credentials
            };

            const response = await request(app)
                .put('/smtp')
                .send(invalidPayload)
                .expect(400);

            expect(response.body.error).toBe('Authentication credentials required');
        });

        it('should handle server errors appropriately', async () => {
            // Mock a server error
            (systemController.updateSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                res.status(500).json({
                    error: 'Failed to update SMTP settings',
                    details: 'Internal server error'
                });
            });

            const response = await request(app)
                .put('/smtp')
                .send(validSmtpPayload)
                .expect(500);

            expect(response.body.error).toBe('Failed to update SMTP settings');
        });

        it('should validate email service type', async () => {
            const invalidPayload = {
                ...validSmtpPayload,
                service: 'INVALID_SERVICE'
            };

            // Mock validation error
            (systemController.updateSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                if (!['GMAIL', 'OUTLOOK', 'HOTMAIL', 'YAHOO', 'CUSTOM'].includes(req.body.service)) {
                    return res.status(400).json({
                        error: 'Invalid email service'
                    });
                }
            });

            const response = await request(app)
                .put('/smtp')
                .send(invalidPayload)
                .expect(400);

            expect(response.body.error).toBe('Invalid email service');
        });
    });

    describe('GET /smtp', () => {
        beforeEach(() => {
            // Setup default mock implementation for get SMTP settings
            (systemController.getSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                res.status(200).json({
                    success: true,
                    config: {
                        systemComponent: 'SMTP',
                        componentConfig: {
                            service: 'GMAIL',
                            host: 'smtp.gmail.com',
                            port: 587,
                            secure: true,
                            auth: {
                                user: 'test@gmail.com'
                                // password intentionally excluded
                            },
                            fromAddress: 'test@gmail.com',
                            isDefault: true
                        },
                        status: 'active'
                    }
                });
            });
        });

        it('should successfully retrieve SMTP settings', async () => {
            const response = await request(app)
                .get('/smtp')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.config).toBeDefined();
            expect(response.body.config.componentConfig.auth.pass).toBeUndefined();
            expect(response.body.config.componentConfig.auth.user).toBeDefined();
        });

        it('should return 404 when no SMTP configuration exists', async () => {
            (systemController.getSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                res.status(404).json({
                    error: 'SMTP configuration not found'
                });
            });

            const response = await request(app)
                .get('/smtp')
                .expect(404);

            expect(response.body.error).toBe('SMTP configuration not found');
        });

        it('should handle server errors appropriately', async () => {
            (systemController.getSmtpSettings as jest.Mock).mockImplementation((req, res) => {
                res.status(500).json({
                    error: 'Failed to fetch SMTP settings',
                    details: 'Internal server error'
                });
            });

            const response = await request(app)
                .get('/smtp')
                .expect(500);

            expect(response.body.error).toBe('Failed to fetch SMTP settings');
        });
    });
});
