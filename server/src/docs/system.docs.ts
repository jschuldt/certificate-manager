/**
 * OpenAPI documentation for system-related endpoints
 * Contains endpoints for system health monitoring and maintenance
 * @module systemDocs
 */
export const systemDocs = {
    '/system/alive': {  // Updated path to match new route configuration
        /**
         * Health check endpoint
         * Used for monitoring system availability and uptime
         * Returns current timestamp for timing verification
         */
        get: {
            tags: ['System'],
            summary: 'Health check endpoint',
            description: 'Returns the health status of the API',
            operationId: 'getSystemHealth',
            responses: {
                200: {
                    description: 'API is alive and responding',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['status', 'timestamp'],
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'alive',
                                        description: 'Current system status'
                                    },
                                    timestamp: {
                                        type: 'string',
                                        format: 'date-time',
                                        description: 'Current server timestamp in ISO format'
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
