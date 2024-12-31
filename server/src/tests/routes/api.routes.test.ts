import request from 'supertest';
import express from 'express';
import apiRoutes from '../../routes/api.routes';

const app = express();
app.use('/', apiRoutes);

describe('API Routes', () => {
  it('should be defined', () => {
    expect(apiRoutes).toBeDefined();
  });

  // Add more tests based on your API endpoints
});
