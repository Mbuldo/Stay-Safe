const protectedRouteSecurity = [{ bearerAuth: [] }];

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Stay-Safe API',
    version: '1.0.0',
    description:
      'Interactive OpenAPI documentation for the Stay-Safe backend. Authenticated routes use Bearer JWT tokens.',
  },
  servers: [
    {
      url: '/',
      description: 'Current deployment origin',
    },
  ],
  tags: [
    { name: 'Health', description: 'Service health and diagnostics' },
    { name: 'Users', description: 'Authentication and profile management' },
    { name: 'Assessments', description: 'Risk assessment workflows' },
    { name: 'AI', description: 'AI-assisted SRH support endpoints' },
    { name: 'Articles', description: 'Educational article library and bookmarks' },
    { name: 'Resources', description: 'Campus and support resource directory' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          details: { type: 'array', items: { type: 'object', additionalProperties: true } },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { $ref: '#/components/schemas/ApiError' },
        },
      },
      UserRegistrationRequest: {
        type: 'object',
        required: ['username', 'password', 'age', 'termsAccepted'],
        properties: {
          username: { type: 'string', example: 'micah' },
          email: { type: 'string', format: 'email', example: 'micah@example.com' },
          age: { type: 'integer', example: 25 },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'],
          },
          password: { type: 'string', example: 'Pass1234' },
          termsAccepted: { type: 'boolean', example: true },
        },
      },
      UserLoginRequest: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', example: 'micah' },
          password: { type: 'string', example: 'Pass1234' },
        },
      },
      AssessmentSubmissionRequest: {
        type: 'object',
        required: ['category', 'responses'],
        properties: {
          category: {
            type: 'string',
            enum: [
              'contraception',
              'sti-risk',
              'pregnancy',
              'menstrual-health',
              'sexual-health',
              'mental-health',
              'general-wellness',
            ],
          },
          responses: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                questionId: { type: 'string' },
                question: { type: 'string' },
                answer: { oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] },
                category: { type: 'string' },
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      AIChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string', example: 'What should I know about contraception?' },
          history: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', enum: ['system', 'user', 'assistant'] },
                content: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { '200': { description: 'Healthy status payload' } },
      },
    },
    '/api/users/register': {
      post: {
        tags: ['Users'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserRegistrationRequest' } },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Validation failed' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/api/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Login an existing user',
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/UserLoginRequest' } },
          },
        },
        responses: {
          '200': { description: 'Authentication succeeded' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Get the current user profile',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Current user profile' }, '401': { description: 'Unauthorized' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update the current user profile',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Updated profile' }, '401': { description: 'Unauthorized' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete the current user account',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Account deleted' }, '401': { description: 'Unauthorized' } },
      },
    },
    '/api/users/me/preferences': {
      get: {
        tags: ['Users'],
        summary: 'Get user preferences',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'User preferences' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user preferences',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Updated preferences' } },
      },
    },
    '/api/assessments': {
      get: {
        tags: ['Assessments'],
        summary: "Get the authenticated user's assessment history",
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Assessment history' } },
      },
      post: {
        tags: ['Assessments'],
        summary: 'Submit a new assessment',
        security: protectedRouteSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssessmentSubmissionRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'Assessment submitted' },
          '400': { description: 'Validation failed' },
        },
      },
    },
    '/api/assessments/questions': {
      get: {
        tags: ['Assessments'],
        summary: 'Get the full assessment question bank',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Assessment questions' } },
      },
    },
    '/api/assessments/questions/{category}': {
      get: {
        tags: ['Assessments'],
        summary: 'Get assessment questions for a specific category',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'category', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Category question set' }, '400': { description: 'Invalid category' } },
      },
    },
    '/api/assessments/stats/me': {
      get: {
        tags: ['Assessments'],
        summary: 'Get assessment statistics for the authenticated user',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Assessment statistics' } },
      },
    },
    '/api/assessments/category/{category}': {
      get: {
        tags: ['Assessments'],
        summary: 'Get assessments filtered by category',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'category', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Category-filtered assessments' }, '400': { description: 'Invalid category' } },
      },
    },
    '/api/assessments/{id}': {
      get: {
        tags: ['Assessments'],
        summary: 'Get an assessment by id',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Assessment details' }, '404': { description: 'Assessment not found' } },
      },
      delete: {
        tags: ['Assessments'],
        summary: 'Delete an assessment',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Assessment deleted' }, '404': { description: 'Assessment not found' } },
      },
    },
    '/api/ai/chat': {
      post: {
        tags: ['AI'],
        summary: 'Send a message to the AI assistant',
        security: protectedRouteSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AIChatRequest' } },
          },
        },
        responses: { '200': { description: 'AI response' }, '400': { description: 'Invalid request' } },
      },
    },
    '/api/ai/health-tips': {
      post: {
        tags: ['AI'],
        summary: 'Generate personalized health tips',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Generated health tips' } },
      },
    },
    '/api/ai/status': {
      get: {
        tags: ['AI'],
        summary: 'Get AI provider status',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'AI status payload' } },
      },
    },
    '/api/articles': {
      get: {
        tags: ['Articles'],
        summary: 'List articles',
        responses: { '200': { description: 'Articles list' } },
      },
    },
    '/api/articles/featured': {
      get: {
        tags: ['Articles'],
        summary: 'Get featured articles',
        responses: { '200': { description: 'Featured articles' } },
      },
    },
    '/api/articles/bookmarks/me': {
      get: {
        tags: ['Articles'],
        summary: 'Get the current user bookmark list',
        security: protectedRouteSecurity,
        responses: { '200': { description: 'Bookmarked articles' } },
      },
    },
    '/api/articles/{articleId}/bookmark': {
      post: {
        tags: ['Articles'],
        summary: 'Bookmark an article',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Bookmark created' }, '409': { description: 'Already bookmarked' } },
      },
      delete: {
        tags: ['Articles'],
        summary: 'Remove an article bookmark',
        security: protectedRouteSecurity,
        parameters: [{ in: 'path', name: 'articleId', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Bookmark removed' } },
      },
    },
    '/api/articles/{slug}': {
      get: {
        tags: ['Articles'],
        summary: 'Get an article by slug',
        parameters: [{ in: 'path', name: 'slug', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Article details' }, '404': { description: 'Article not found' } },
      },
    },
    '/api/resources': {
      get: {
        tags: ['Resources'],
        summary: 'List campus and support resources',
        responses: { '200': { description: 'Resources list' } },
      },
    },
    '/api/resources/type/{type}': {
      get: {
        tags: ['Resources'],
        summary: 'Get resources by type',
        parameters: [{ in: 'path', name: 'type', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Resources for the requested type' } },
      },
    },
    '/api/resources/category/{category}': {
      get: {
        tags: ['Resources'],
        summary: 'Get resources by category',
        parameters: [{ in: 'path', name: 'category', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Resources for the requested category' } },
      },
    },
    '/api/resources/{id}': {
      get: {
        tags: ['Resources'],
        summary: 'Get a resource by id',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Resource details' }, '404': { description: 'Resource not found' } },
      },
    },
  },
};

export default openApiSpec;
