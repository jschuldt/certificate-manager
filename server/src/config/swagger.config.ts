import { apiDocs } from '../docs/api.docs';

/**
 * Swagger/OpenAPI configuration object
 * Defines the API documentation structure and endpoints
 */
const swaggerOptions = {
  definition: {
    // OpenAPI version and basic API information
    openapi: '3.0.0',
    info: {
      title: 'Certificate Manager API',
      version: '1.0.0',
      description: 'API for managing SSL certificates'
    },

    // API server configuration
    servers: [
      {
        url: '/api',
        description: 'API server'
      }
    ],

    // API endpoint definitions
    paths: {
      // Health check endpoint
      '/alive': {  // Changed from '/' to '/alive'
        get: apiDocs.paths['/alive'].get
      },
      // Certificate management endpoints
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
      },
      '/certificates/{id}/refresh': {
        ...apiDocs.paths.certificateRefresh
      },
      '/certificates/pull': {
        ...apiDocs.paths.pullCertificate
      },
      // Add user paths
      '/users': {
        ...apiDocs.paths['/users']
      },
      '/users/{id}': {
        ...apiDocs.paths['/users/{id}']
      },
      '/users/search': {
        ...apiDocs.paths['/users/search']
      },
      '/users/login': {
        ...apiDocs.paths['/users/login']
      }
    },

    // Shared components (schemas, responses, etc.)
    components: {
      schemas: {
        ...apiDocs.components.schemas,
        // Remove or update any User schema references here
        // Use UserResponse instead
      }
    }
  },
  // Location of route files for Swagger to scan
  apis: ['./src/routes/*.ts']
};

export default swaggerOptions;
