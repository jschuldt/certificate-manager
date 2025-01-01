export const userDocs = {
    '/users': {
        post: {
            tags: ['Users'],
            summary: 'Create a new user',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['firstName', 'lastName', 'email', 'password'],
                            properties: {
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string', format: 'password' },
                                notificationPreferences: {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                isActive: { type: 'boolean', default: true }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    user: {
                                        $ref: '#/components/schemas/UserResponse'
                                    }
                                }
                            }
                        }
                    }
                },
                400: { description: 'Invalid input' }
            }
        },
        get: {
            tags: ['Users'],
            summary: 'Get all users',
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
                    description: 'List of users retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    users: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/UserResponse'
                                        }
                                    },
                                    total: {
                                        type: 'integer'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            parameters: [{
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' }
            }],
            responses: {
                200: {
                    description: 'User found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserResponse'
                            }
                        }
                    }
                },
                404: { description: 'User not found' }
            }
        },
        put: {
            tags: ['Users'],
            summary: 'Update user by ID',
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
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                email: { type: 'string', format: 'email' },
                                password: { type: 'string', format: 'password' },
                                notificationPreferences: {
                                    type: 'array',
                                    items: { type: 'string' }
                                },
                                isActive: { type: 'boolean' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserResponse'
                            }
                        }
                    }
                },
                404: { description: 'User not found' }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete user by ID',
            parameters: [{
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' }
            }],
            responses: {
                204: { description: 'User deleted successfully' },
                404: { description: 'User not found' }
            }
        }
    },
    '/users/search': {
        get: {
            tags: ['Users'],
            summary: 'Search users',
            parameters: [{
                in: 'query',
                name: 'firstName',
                schema: { type: 'string' }
            }, {
                in: 'query',
                name: 'lastName',
                schema: { type: 'string' }
            }, {
                in: 'query',
                name: 'email',
                schema: { type: 'string' }
            }],
            responses: {
                200: {
                    description: 'Search results',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/UserResponse'
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    '/users/login': {
        post: {
            tags: ['Users'],
            summary: 'Login user',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password'],
                            properties: {
                                email: {
                                    type: 'string',
                                    format: 'email'
                                },
                                password: {
                                    type: 'string',
                                    format: 'password'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User logged in successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/UserResponse'
                            }
                        }
                    }
                },
                401: {
                    description: 'Invalid credentials'
                }
            }
        }
    },
    components: {
        schemas: {
            UserBase: {
                type: 'object',
                properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    notificationPreferences: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    isActive: { type: 'boolean' }
                }
            },
            UserCreate: {
                allOf: [
                    { $ref: '#/components/schemas/UserBase' },
                    {
                        type: 'object',
                        required: ['firstName', 'lastName', 'email', 'password'],
                        properties: {
                            password: { type: 'string', format: 'password' }
                        }
                    }
                ]
            },
            UserResponse: {
                allOf: [
                    { $ref: '#/components/schemas/UserBase' },
                    {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            isDeleted: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            }
        }
    }
};
