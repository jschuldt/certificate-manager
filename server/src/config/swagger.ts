import swaggerJsdoc from 'swagger-jsdoc';
import { apiDocs } from '../docs/api.docs';

const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Certificate Manager API',
      version: '1.0.0',
      description: 'API for managing SSL certificates',
    },
    servers: [
      {
        url: 'http://localhost:3443',
        description: 'Development server',
      },
    ],
    basePath: '/api',
    tags: [
      {
        name: 'General',
        description: 'General endpoints'
      },
      {
        name: 'Certificate',
        description: 'Certificate management endpoints'
      }
    ],
    paths: {
      '/api': {
        ...apiDocs.welcome
      },
      '/api/check-certificate': {
        ...apiDocs.checkCertificate
      },
      '/api/certificates': {
        ...apiDocs.certificates
      },
      '/api/certificates/{id}': {
        ...apiDocs.certificateById
      },
      '/api/certificates/search': {
        ...apiDocs.certificateSearch
      },
      '/api/certificates/expiring/{days}': {
        ...apiDocs.certificateExpiring
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

export default options;
