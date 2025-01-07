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
    },
    '/system/email': {
        post: {
            tags: ['System'],
            summary: 'Send email using SMTP configuration',
            description: 'Sends an email using the configured SMTP settings',
            operationId: 'sendEmail',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['to', 'subject', 'message'],
                            properties: {
                                to: {
                                    type: 'string',
                                    format: 'email',
                                    description: 'Recipient email address',
                                    example: 'recipient@example.com'
                                },
                                subject: {
                                    type: 'string',
                                    description: 'Email subject line',
                                    example: 'Test Email Subject'
                                },
                                message: {
                                    type: 'string',
                                    description: 'Email body content',
                                    example: 'This is a test email message'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Email sent successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Email sent successfully'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    description: 'Invalid request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        example: 'Invalid email format'
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        example: 'Failed to send email'
                                    },
                                    details: {
                                        type: 'string',
                                        example: 'SMTP configuration error'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/system/smtp': {
        get: {
            tags: ['System'],
            summary: 'Get SMTP configuration',
            description: 'Retrieves the current SMTP settings',
            operationId: 'getSmtpSettings',
            responses: {
                200: {
                    description: 'SMTP settings retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    config: {
                                        type: 'object',
                                        properties: {
                                            systemComponent: {
                                                type: 'string',
                                                example: 'SMTP'
                                            },
                                            componentConfig: {
                                                type: 'object',
                                                properties: {
                                                    service: {
                                                        type: 'string',
                                                        enum: ['GMAIL', 'OUTLOOK', 'HOTMAIL', 'YAHOO', 'CUSTOM']
                                                    },
                                                    host: { type: 'string' },
                                                    port: { type: 'number' },
                                                    secure: { type: 'boolean' },
                                                    auth: {
                                                        type: 'object',
                                                        properties: {
                                                            user: { type: 'string' }
                                                        }
                                                    },
                                                    fromAddress: { type: 'string' },
                                                    isDefault: { type: 'boolean' }
                                                }
                                            },
                                            status: {
                                                type: 'string',
                                                enum: ['active', 'inactive', 'error']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'SMTP configuration not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        example: 'SMTP configuration not found'
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string' },
                                    details: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        },
        put: {
            tags: ['System'],
            summary: 'Update SMTP configuration',
            description: 'Updates the system SMTP settings',
            operationId: 'updateSmtpSettings',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['service', 'host', 'port', 'auth', 'fromAddress'],
                            properties: {
                                service: {
                                    type: 'string',
                                    enum: ['GMAIL', 'OUTLOOK', 'HOTMAIL', 'YAHOO', 'CUSTOM'],
                                    description: 'Email service provider'
                                },
                                host: {
                                    type: 'string',
                                    description: 'SMTP server hostname'
                                },
                                port: {
                                    type: 'number',
                                    description: 'SMTP server port'
                                },
                                secure: {
                                    type: 'boolean',
                                    default: true
                                },
                                auth: {
                                    type: 'object',
                                    required: ['user', 'pass'],
                                    properties: {
                                        user: {
                                            type: 'string'
                                        },
                                        pass: {
                                            type: 'string',
                                            format: 'password'
                                        }
                                    }
                                },
                                fromAddress: {
                                    type: 'string',
                                    format: 'email'
                                },
                                isDefault: {
                                    type: 'boolean',
                                    default: true
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'SMTP settings updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: true
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'SMTP settings updated successfully'
                                    },
                                    config: {
                                        type: 'object',
                                        properties: {
                                            service: { type: 'string' },
                                            host: { type: 'string' },
                                            port: { type: 'number' },
                                            // Password excluded from response
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                500: {
                    description: 'Server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string' },
                                    details: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
