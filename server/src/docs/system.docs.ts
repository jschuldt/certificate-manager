export const systemDocs = {
    '/alive': {
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
