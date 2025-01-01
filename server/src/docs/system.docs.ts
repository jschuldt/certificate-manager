/**
 * OpenAPI documentation for system-related endpoints
 * Contains endpoints for system health monitoring and maintenance
 * @module systemDocs
 */
export const systemDocs = {
    '/alive': {
        /**
         * Health check endpoint
         * Used for monitoring system availability and uptime
         * Returns current timestamp for timing verification
         */
        get: {
            tags: ['System'],
            summary: 'Health check endpoint',
            description: 'Returns the health status of the API',
            responses: {
                200: {
                    description: 'API is alive',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'alive'
                                    },
                                    timestamp: {
                                        type: 'string',
                                        format: 'date-time'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
