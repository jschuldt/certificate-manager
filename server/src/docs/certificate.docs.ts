/**
 * OpenAPI documentation for Certificate Management API endpoints
 */
export const certificateDocs = {
    /**
     * Endpoint for checking SSL/TLS certificates of a given URL
     * Used for initial certificate validation and information gathering
     */
    checkCertificate: {
        get: {
            tags: ['Pull Certificate'],
            summary: 'Pull TLS certificate data on a given URL',
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

    /**
     * Core certificate management endpoints
     * Handles CRUD operations for certificate records
     */
    certificates: {
        post: {
            tags: ['Certificates'],
            summary: 'Create a new certificate',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            oneOf: [
                                {
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
                                        certLastQueried: { type: 'string', format: 'date-time' },
                                        metadata: {
                                            type: 'object',
                                            properties: {
                                                country: { type: 'string' },
                                                state: { type: 'string' },
                                                locality: { type: 'string' },
                                                alternativeNames: {
                                                    type: 'array',
                                                    items: { type: 'string' }
                                                },
                                                fingerprint: { type: 'string' },
                                                bits: { type: 'number' }
                                            }
                                        },
                                        certManager: {
                                            type: 'object',
                                            required: ['website'],
                                            properties: {
                                                website: { type: 'string' },
                                                responsiblePerson: { type: 'string' },
                                                alertDate: { type: 'string', format: 'date-time' },
                                                comments: { type: 'string' }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Certificate created successfully' },
                400: { description: 'Invalid input' }
            }
        },
        /**
         * Retrieves paginated list of all certificates
         * Supports pagination parameters for handling large datasets
         */
        get: {
            tags: ['Certificates'],
            summary: 'Get all certificates',
            parameters: [{
                in: 'query',
                name: 'page',
                schema: {
                    type: 'integer',
                    default: 1,
                    minimum: 1
                },
                description: 'Page number'
            }, {
                in: 'query',
                name: 'limit',
                schema: {
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 100
                },
                description: 'Number of records per page'
            }],
            responses: {
                200: {
                    description: 'List of certificates retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    certificates: {
                                        type: 'array',
                                        items: {
                                            type: 'object'
                                        }
                                    },
                                    total: {
                                        type: 'integer',
                                        description: 'Total number of records'
                                    },
                                    page: {
                                        type: 'integer',
                                        description: 'Current page number'
                                    },
                                    totalPages: {
                                        type: 'integer',
                                        description: 'Total number of pages'
                                    }
                                }
                            }
                        }
                    }
                },
                500: { description: 'Server error' }
            }
        }
    },

    /**
     * Single certificate operations
     * Handles individual certificate retrieval, updates, and deletion
     */
    certificateById: {
        /**
         * Retrieves detailed information about a specific certificate
         */
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
        /**
         * Updates certificate information
         * Allows modification of both certificate data and management metadata
         */
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
                                certLastQueried: { type: 'string', format: 'date-time' },
                                metadata: {
                                    type: 'object',
                                    properties: {
                                        country: { type: 'string' },
                                        state: { type: 'string' },
                                        locality: { type: 'string' },
                                        alternativeNames: {
                                            type: 'array',
                                            items: { type: 'string' }
                                        },
                                        fingerprint: { type: 'string' },
                                        bits: { type: 'number' }
                                    }
                                },
                                certManager: {
                                    type: 'object',
                                    properties: {
                                        website: { type: 'string' },
                                        responsiblePerson: { type: 'string' },
                                        alertDate: { type: 'string', format: 'date-time' },
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
        /**
         * Removes certificate from the system
         * This operation cannot be undone
         */
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

    /**
     * Certificate search functionality
     * Provides flexible search capabilities across multiple certificate attributes
     * Supports partial matching and pagination
     */
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
                name: 'website',
                schema: { type: 'string' }
            }, {
                in: 'query',
                name: 'responsiblePerson',
                schema: { type: 'string' }
            }, {
                in: 'query',
                name: 'page',
                schema: {
                    type: 'integer',
                    default: 1,
                    minimum: 1
                },
                description: 'Page number'
            }, {
                in: 'query',
                name: 'limit',
                schema: {
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 100
                },
                description: 'Number of records per page'
            }],
            responses: {
                200: {
                    description: 'Search results',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    certificates: {
                                        type: 'array',
                                        items: { type: 'object' }
                                    },
                                    total: {
                                        type: 'integer',
                                        description: 'Total number of records'
                                    },
                                    page: {
                                        type: 'integer',
                                        description: 'Current page number'
                                    },
                                    totalPages: {
                                        type: 'integer',
                                        description: 'Total number of pages'
                                    }
                                }
                            }
                        }
                    }
                },
                500: { description: 'Server error' }
            }
        }
    },

    /**
     * Expiring certificates monitoring
     * Critical for certificate lifecycle management and renewal planning
     * Default threshold is 30 days
     */
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
            }, {
                in: 'query',
                name: 'page',
                schema: {
                    type: 'integer',
                    default: 1,
                    minimum: 1
                },
                description: 'Page number'
            }, {
                in: 'query',
                name: 'limit',
                schema: {
                    type: 'integer',
                    default: 10,
                    minimum: 1,
                    maximum: 100
                },
                description: 'Number of records per page'
            }],
            responses: {
                200: {
                    description: 'List of expiring certificates',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    certificates: {
                                        type: 'array',
                                        items: { type: 'object' }
                                    },
                                    total: {
                                        type: 'integer',
                                        description: 'Total number of records'
                                    },
                                    page: {
                                        type: 'integer',
                                        description: 'Current page number'
                                    },
                                    totalPages: {
                                        type: 'integer',
                                        description: 'Total number of pages'
                                    }
                                }
                            }
                        }
                    }
                },
                500: { description: 'Server error' }
            }
        }
    },

    /**
     * Bulk certificate operations
     * Enables batch processing for multiple certificates
     * Useful for initial data import or mass updates
     */
    '/certificates/bulk': {
        post: {
            tags: ['Certificates'],
            summary: 'Create multiple certificates',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: {
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
                                    certLastQueried: { type: 'string', format: 'date-time' },
                                    metadata: {
                                        type: 'object',
                                        properties: {
                                            website: { type: 'string' },
                                            responsiblePerson: { type: 'string' },
                                            renewalDate: { type: 'string', format: 'date-time' },
                                            comments: { type: 'string' }
                                        }
                                    },
                                    certManager: {
                                        type: 'object',
                                        required: ['website'],
                                        properties: {
                                            website: { type: 'string' },
                                            responsiblePerson: { type: 'string' },
                                            alertDate: { type: 'string', format: 'date-time' },
                                            comments: { type: 'string' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Certificates created successfully' },
                400: { description: 'Invalid input' }
            }
        }
    }
};
