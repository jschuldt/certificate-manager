export const apiDocs = {
  welcome: {
    get: {
      tags: ['General'],
      summary: 'Welcome endpoint',
      description: 'Returns a welcome message for the API',
      responses: {
        200: {
          description: 'Welcome message',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  checkCertificate: {
    get: {
      tags: ['Certificate'],
      summary: 'Check SSL certificate for a given URL',
      description: 'Retrieves SSL certificate information for the provided URL',
      parameters: [
        {
          in: 'query',
          name: 'url',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'The URL to check the SSL certificate for'
        }
      ],
      responses: {
        200: {
          description: 'Certificate information retrieved successfully'
        },
        400: {
          description: 'Missing or invalid URL parameter'
        },
        500: {
          description: 'Server error while fetching certificate'
        }
      }
    }
  },
  certificates: {
    post: {
      tags: ['Certificates'],
      summary: 'Create a new certificate',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['certManager'],
              properties: {
                name: { type: 'string' },
                issuer: { type: 'string' },
                validFrom: { type: 'string', format: 'date-time' },
                validTo: { type: 'string', format: 'date-time' },
                serialNumber: { type: 'string' },
                subject: { type: 'string' },
                organization: { type: 'string' },
                organizationalUnit: { type: 'string' },
                metadataWebsite: { type: 'string' },
                metadataResponsiblePerson: { type: 'string' },
                metadataRenewalDate: { type: 'string', format: 'date-time' },
                metadataComments: { type: 'string' },
                certLastQueried: { type: 'string', format: 'date-time' },
                certManager: {
                  type: 'object',
                  required: ['website'],
                  properties: {
                    website: { type: 'string' },
                    responsiblePerson: { type: 'string' },
                    renewalDate: { type: 'string', format: 'date-time' },
                    comments: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: { description: 'Certificate created successfully' },
        400: { description: 'Invalid input' }
      }
    },
    get: {
      tags: ['Certificates'],
      summary: 'Get all certificates',
      responses: {
        200: { description: 'List of certificates retrieved successfully' },
        500: { description: 'Server error' }
      }
    }
  },
  certificateById: {
    get: {
      tags: ['Certificates'],
      summary: 'Get certificate by ID',
      parameters: [{
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        200: { description: 'Certificate found' },
        404: { description: 'Certificate not found' }
      }
    },
    put: {
      tags: ['Certificates'],
      summary: 'Update certificate by ID',
      parameters: [{
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' }
      }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                issuer: { type: 'string' },
                validFrom: { type: 'string', format: 'date-time' },
                validTo: { type: 'string', format: 'date-time' },
                serialNumber: { type: 'string' },
                subject: { type: 'string' },
                organization: { type: 'string' },
                organizationalUnit: { type: 'string' },
                metadataWebsite: { type: 'string' },
                metadataResponsiblePerson: { type: 'string' },
                metadataRenewalDate: { type: 'string', format: 'date-time' },
                metadataComments: { type: 'string' },
                certLastQueried: { type: 'string', format: 'date-time' },
                certManager: {
                  type: 'object',
                  properties: {
                    website: { type: 'string' },
                    responsiblePerson: { type: 'string' },
                    renewalDate: { type: 'string', format: 'date-time' },
                    comments: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: { description: 'Certificate updated successfully' },
        404: { description: 'Certificate not found' },
        400: { description: 'Invalid input' }
      }
    },
    delete: {
      tags: ['Certificates'],
      summary: 'Delete certificate by ID',
      parameters: [{
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' }
      }],
      responses: {
        204: { description: 'Certificate deleted successfully' },
        404: { description: 'Certificate not found' }
      }
    }
  },
  certificateSearch: {
    get: {
      tags: ['Certificates'],
      summary: 'Search certificates',
      parameters: [{
        in: 'query',
        name: 'name',
        schema: { type: 'string' }
      }, {
        in: 'query',
        name: 'issuer',
        schema: { type: 'string' }
      }, {
        in: 'query',
        name: 'organization',
        schema: { type: 'string' }
      }, {
        in: 'query',
        name: 'website',  // Changed from certManager.website to website
        schema: { type: 'string' }
      }],
      responses: {
        200: { description: 'Search results' },
        500: { description: 'Server error' }
      }
    }
  },
  certificateExpiring: {
    get: {
      tags: ['Certificates'],
      summary: 'Get expiring certificates',
      parameters: [{
        in: 'path',
        name: 'days',
        schema: { 
          type: 'integer',
          default: 30
        },
        description: 'Number of days threshold'
      }],
      responses: {
        200: { description: 'List of expiring certificates' },
        500: { description: 'Server error' }
      }
    }
  }
};
