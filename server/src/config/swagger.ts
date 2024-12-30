import { apiDocs } from '../docs/api.docs';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Certificate Manager API',
      version: '1.0.0',
      description: 'API for managing SSL certificates'
    },
    servers: [
      {
        url: '/api',
        description: 'API server'
      }
    ],
    paths: {
      '/alive': {  // Changed from '/' to '/alive'
        get: apiDocs.paths['/alive'].get
      },
      '/check-certificate': {
        ...apiDocs.paths.checkCertificate
      },
      '/certificates': {
        ...apiDocs.paths.certificates
      },
      '/certificates/{id}': {
        ...apiDocs.paths.certificateById
      },
      '/certificates/search': {
        ...apiDocs.paths.certificateSearch
      },
      '/certificates/expiring/{days}': {
        ...apiDocs.paths.certificateExpiring
      },
      '/certificates/bulk': {
        ...apiDocs.paths['/certificates/bulk']
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

export default swaggerOptions;