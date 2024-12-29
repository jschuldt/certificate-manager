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
  }
};
