import { OpenAPISpec } from './types';

/**
 * Web Search Tool - Search the web for information
 * MCP tool for performing web searches across multiple search engines
 */
export const webSearchSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Web Search Tool',
    version: '1.0.0',
    description: 'MCP tool for searching the web and retrieving information from various search engines',
  },
  servers: [
    {
      url: 'https://api.search-tool.com/v1',
      description: 'Production search server',
    },
  ],
  paths: {
    '/search': {
      post: {
        summary: 'Perform a web search',
        operationId: 'webSearch',
        tags: ['search'],
        description: 'Search the web using multiple search engines and return aggregated results',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query',
                  },
                  maxResults: {
                    type: 'integer',
                    description: 'Maximum number of results to return',
                    default: 10,
                    minimum: 1,
                    maximum: 100,
                  },
                  engine: {
                    type: 'string',
                    enum: ['google', 'bing', 'duckduckgo', 'brave'],
                    default: 'google',
                    description: 'Search engine to use',
                  },
                  safeSearch: {
                    type: 'boolean',
                    default: true,
                    description: 'Enable safe search filtering',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Search results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SearchResults',
                },
              },
            },
          },
        },
      },
    },
    '/search/news': {
      post: {
        summary: 'Search for news articles',
        operationId: 'newsSearch',
        tags: ['search', 'news'],
        description: 'Search for recent news articles',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query',
                  },
                  daysBack: {
                    type: 'integer',
                    description: 'Number of days back to search',
                    default: 7,
                    minimum: 1,
                    maximum: 30,
                  },
                  language: {
                    type: 'string',
                    description: 'Language code (e.g., en, es, fr)',
                    default: 'en',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'News search results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NewsResults',
                },
              },
            },
          },
        },
      },
    },
    '/search/images': {
      post: {
        summary: 'Search for images',
        operationId: 'imageSearch',
        tags: ['search', 'images'],
        description: 'Search for images on the web',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query',
                  },
                  maxResults: {
                    type: 'integer',
                    default: 20,
                  },
                  size: {
                    type: 'string',
                    enum: ['small', 'medium', 'large', 'any'],
                    default: 'any',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Image search results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ImageResults',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      SearchResults: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
          },
          totalResults: {
            type: 'integer',
          },
          results: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/SearchResult',
            },
          },
          searchTime: {
            type: 'number',
            description: 'Search time in seconds',
          },
        },
      },
      SearchResult: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          url: {
            type: 'string',
            format: 'uri',
          },
          snippet: {
            type: 'string',
          },
          displayUrl: {
            type: 'string',
          },
        },
      },
      NewsResults: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
          },
          articles: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/NewsArticle',
            },
          },
        },
      },
      NewsArticle: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          url: {
            type: 'string',
            format: 'uri',
          },
          source: {
            type: 'string',
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
          },
          snippet: {
            type: 'string',
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      ImageResults: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
          },
          images: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ImageResult',
            },
          },
        },
      },
      ImageResult: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            format: 'uri',
          },
          thumbnailUrl: {
            type: 'string',
            format: 'uri',
          },
          title: {
            type: 'string',
          },
          width: {
            type: 'integer',
          },
          height: {
            type: 'integer',
          },
          sourceUrl: {
            type: 'string',
            format: 'uri',
          },
        },
      },
    },
  },
};

/**
 * Computer Use Tool - Control computer operations
 * MCP tool for executing commands, managing files, and controlling the OS
 */
export const computerUseSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Computer Use Tool',
    version: '1.0.0',
    description: 'MCP tool for computer control, file operations, and system automation',
  },
  servers: [
    {
      url: 'http://localhost:8080/v1',
      description: 'Local computer control server',
    },
  ],
  paths: {
    '/execute': {
      post: {
        summary: 'Execute a command',
        operationId: 'executeCommand',
        tags: ['system'],
        description: 'Execute a shell command on the system',
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['command'],
                properties: {
                  command: {
                    type: 'string',
                    description: 'Shell command to execute',
                  },
                  workingDirectory: {
                    type: 'string',
                    description: 'Working directory for command execution',
                  },
                  timeout: {
                    type: 'integer',
                    description: 'Command timeout in seconds',
                    default: 30,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Command execution result',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CommandResult',
                },
              },
            },
          },
        },
      },
    },
    '/files/read': {
      post: {
        summary: 'Read a file',
        operationId: 'readFile',
        tags: ['files'],
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['path'],
                properties: {
                  path: {
                    type: 'string',
                    description: 'File path to read',
                  },
                  encoding: {
                    type: 'string',
                    enum: ['utf8', 'base64', 'binary'],
                    default: 'utf8',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File contents',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FileContent',
                },
              },
            },
          },
        },
      },
    },
    '/files/write': {
      post: {
        summary: 'Write to a file',
        operationId: 'writeFile',
        tags: ['files'],
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['path', 'content'],
                properties: {
                  path: {
                    type: 'string',
                    description: 'File path to write',
                  },
                  content: {
                    type: 'string',
                    description: 'Content to write',
                  },
                  encoding: {
                    type: 'string',
                    enum: ['utf8', 'base64'],
                    default: 'utf8',
                  },
                  createDirs: {
                    type: 'boolean',
                    default: false,
                    description: 'Create parent directories if they dont exist',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'File written successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/WriteResult',
                },
              },
            },
          },
        },
      },
    },
    '/screenshot': {
      post: {
        summary: 'Take a screenshot',
        operationId: 'takeScreenshot',
        tags: ['screen'],
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  format: {
                    type: 'string',
                    enum: ['png', 'jpeg'],
                    default: 'png',
                  },
                  quality: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 100,
                    default: 90,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Screenshot captured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Screenshot',
                },
              },
            },
          },
        },
      },
    },
    '/mouse/click': {
      post: {
        summary: 'Click mouse at coordinates',
        operationId: 'mouseClick',
        tags: ['input'],
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['x', 'y'],
                properties: {
                  x: {
                    type: 'integer',
                    description: 'X coordinate',
                  },
                  y: {
                    type: 'integer',
                    description: 'Y coordinate',
                  },
                  button: {
                    type: 'string',
                    enum: ['left', 'right', 'middle'],
                    default: 'left',
                  },
                  clickCount: {
                    type: 'integer',
                    default: 1,
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Click executed',
          },
        },
      },
    },
    '/keyboard/type': {
      post: {
        summary: 'Type text using keyboard',
        operationId: 'keyboardType',
        tags: ['input'],
        security: [
          {
            apiKey: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['text'],
                properties: {
                  text: {
                    type: 'string',
                    description: 'Text to type',
                  },
                  delay: {
                    type: 'integer',
                    description: 'Delay between keystrokes in milliseconds',
                    default: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Text typed successfully',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      CommandResult: {
        type: 'object',
        properties: {
          stdout: {
            type: 'string',
          },
          stderr: {
            type: 'string',
          },
          exitCode: {
            type: 'integer',
          },
          executionTime: {
            type: 'number',
            description: 'Execution time in seconds',
          },
        },
      },
      FileContent: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
          size: {
            type: 'integer',
            description: 'File size in bytes',
          },
          encoding: {
            type: 'string',
          },
        },
      },
      WriteResult: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
          },
          bytesWritten: {
            type: 'integer',
          },
          success: {
            type: 'boolean',
          },
        },
      },
      Screenshot: {
        type: 'object',
        properties: {
          imageData: {
            type: 'string',
            description: 'Base64 encoded image',
          },
          width: {
            type: 'integer',
          },
          height: {
            type: 'integer',
          },
          format: {
            type: 'string',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
};

/**
 * Browser Use Tool - Automate web browser
 * MCP tool for browser automation and web scraping
 */
export const browserUseSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Browser Use Tool',
    version: '1.0.0',
    description: 'MCP tool for browser automation, web scraping, and interaction',
  },
  servers: [
    {
      url: 'http://localhost:9222/v1',
      description: 'Local browser automation server',
    },
  ],
  paths: {
    '/browser/navigate': {
      post: {
        summary: 'Navigate to a URL',
        operationId: 'navigateTo',
        tags: ['navigation'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: 'URL to navigate to',
                  },
                  waitUntil: {
                    type: 'string',
                    enum: ['load', 'domcontentloaded', 'networkidle'],
                    default: 'load',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Navigation successful',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NavigationResult',
                },
              },
            },
          },
        },
      },
    },
    '/browser/click': {
      post: {
        summary: 'Click an element',
        operationId: 'clickElement',
        tags: ['interaction'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['selector'],
                properties: {
                  selector: {
                    type: 'string',
                    description: 'CSS selector for element to click',
                  },
                  waitForSelector: {
                    type: 'boolean',
                    default: true,
                  },
                  timeout: {
                    type: 'integer',
                    description: 'Timeout in milliseconds',
                    default: 30000,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Element clicked successfully',
          },
        },
      },
    },
    '/browser/type': {
      post: {
        summary: 'Type into an input field',
        operationId: 'typeIntoField',
        tags: ['interaction'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['selector', 'text'],
                properties: {
                  selector: {
                    type: 'string',
                    description: 'CSS selector for input field',
                  },
                  text: {
                    type: 'string',
                    description: 'Text to type',
                  },
                  clearFirst: {
                    type: 'boolean',
                    default: true,
                    description: 'Clear field before typing',
                  },
                  delay: {
                    type: 'integer',
                    description: 'Delay between keystrokes in milliseconds',
                    default: 0,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Text typed successfully',
          },
        },
      },
    },
    '/browser/screenshot': {
      post: {
        summary: 'Take a screenshot of the page',
        operationId: 'takePageScreenshot',
        tags: ['capture'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullPage: {
                    type: 'boolean',
                    default: false,
                    description: 'Capture full page',
                  },
                  selector: {
                    type: 'string',
                    description: 'CSS selector to screenshot specific element',
                  },
                  format: {
                    type: 'string',
                    enum: ['png', 'jpeg'],
                    default: 'png',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Screenshot captured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Screenshot',
                },
              },
            },
          },
        },
      },
    },
    '/browser/extract': {
      post: {
        summary: 'Extract data from page',
        operationId: 'extractData',
        tags: ['scraping'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['selector'],
                properties: {
                  selector: {
                    type: 'string',
                    description: 'CSS selector for elements to extract',
                  },
                  attribute: {
                    type: 'string',
                    description: 'Attribute to extract (default: textContent)',
                  },
                  multiple: {
                    type: 'boolean',
                    default: false,
                    description: 'Extract multiple elements',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Data extracted',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ExtractedData',
                },
              },
            },
          },
        },
      },
    },
    '/browser/pdf': {
      post: {
        summary: 'Generate PDF of current page',
        operationId: 'generatePDF',
        tags: ['capture'],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  format: {
                    type: 'string',
                    enum: ['letter', 'a4', 'legal'],
                    default: 'a4',
                  },
                  landscape: {
                    type: 'boolean',
                    default: false,
                  },
                  printBackground: {
                    type: 'boolean',
                    default: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'PDF generated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PDFResult',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      NavigationResult: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            format: 'uri',
          },
          title: {
            type: 'string',
          },
          status: {
            type: 'integer',
          },
          loadTime: {
            type: 'number',
            description: 'Page load time in seconds',
          },
        },
      },
      Screenshot: {
        type: 'object',
        properties: {
          imageData: {
            type: 'string',
            description: 'Base64 encoded image',
          },
          width: {
            type: 'integer',
          },
          height: {
            type: 'integer',
          },
          format: {
            type: 'string',
          },
        },
      },
      ExtractedData: {
        type: 'object',
        properties: {
          selector: {
            type: 'string',
          },
          data: {
            oneOf: [
              {
                type: 'string',
              },
              {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            ],
          },
          count: {
            type: 'integer',
          },
        },
      },
      PDFResult: {
        type: 'object',
        properties: {
          pdfData: {
            type: 'string',
            description: 'Base64 encoded PDF',
          },
          size: {
            type: 'integer',
            description: 'PDF size in bytes',
          },
        },
      },
    },
  },
};

/**
 * API Calling Tool - Make HTTP API requests
 * MCP tool for calling external APIs with authentication and data transformation
 */
export const apiCallingSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'API Calling Tool',
    version: '1.0.0',
    description: 'MCP tool for making HTTP requests to external APIs with auth and data transformation',
  },
  servers: [
    {
      url: 'https://api.proxy-service.com/v1',
      description: 'API proxy server',
    },
  ],
  paths: {
    '/request': {
      post: {
        summary: 'Make an HTTP request',
        operationId: 'makeRequest',
        tags: ['http'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url', 'method'],
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: 'Target API URL',
                  },
                  method: {
                    type: 'string',
                    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                    description: 'HTTP method',
                  },
                  headers: {
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                    description: 'Request headers',
                  },
                  body: {
                    type: 'object',
                    description: 'Request body (for POST/PUT/PATCH)',
                  },
                  queryParams: {
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                    description: 'Query parameters',
                  },
                  timeout: {
                    type: 'integer',
                    description: 'Request timeout in milliseconds',
                    default: 30000,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Request completed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HTTPResponse',
                },
              },
            },
          },
        },
      },
    },
    '/request/graphql': {
      post: {
        summary: 'Make a GraphQL query',
        operationId: 'graphqlQuery',
        tags: ['graphql'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['endpoint', 'query'],
                properties: {
                  endpoint: {
                    type: 'string',
                    format: 'uri',
                    description: 'GraphQL endpoint URL',
                  },
                  query: {
                    type: 'string',
                    description: 'GraphQL query or mutation',
                  },
                  variables: {
                    type: 'object',
                    description: 'Query variables',
                  },
                  headers: {
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'GraphQL response',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/GraphQLResponse',
                },
              },
            },
          },
        },
      },
    },
    '/request/batch': {
      post: {
        summary: 'Make multiple requests in batch',
        operationId: 'batchRequests',
        tags: ['http', 'batch'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['requests'],
                properties: {
                  requests: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'url', 'method'],
                      properties: {
                        id: {
                          type: 'string',
                          description: 'Request identifier',
                        },
                        url: {
                          type: 'string',
                          format: 'uri',
                        },
                        method: {
                          type: 'string',
                          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                        },
                        headers: {
                          type: 'object',
                          additionalProperties: {
                            type: 'string',
                          },
                        },
                        body: {
                          type: 'object',
                        },
                      },
                    },
                  },
                  parallel: {
                    type: 'boolean',
                    default: true,
                    description: 'Execute requests in parallel',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Batch results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BatchResponse',
                },
              },
            },
          },
        },
      },
    },
    '/auth/oauth': {
      post: {
        summary: 'Perform OAuth authentication',
        operationId: 'oauthAuth',
        tags: ['auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['tokenUrl', 'clientId', 'clientSecret'],
                properties: {
                  tokenUrl: {
                    type: 'string',
                    format: 'uri',
                    description: 'OAuth token endpoint',
                  },
                  clientId: {
                    type: 'string',
                  },
                  clientSecret: {
                    type: 'string',
                  },
                  scope: {
                    type: 'string',
                  },
                  grantType: {
                    type: 'string',
                    enum: ['client_credentials', 'password', 'authorization_code'],
                    default: 'client_credentials',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'OAuth token obtained',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OAuthToken',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HTTPResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'integer',
          },
          statusText: {
            type: 'string',
          },
          headers: {
            type: 'object',
            additionalProperties: {
              type: 'string',
            },
          },
          body: {
            type: 'object',
          },
          responseTime: {
            type: 'number',
            description: 'Response time in milliseconds',
          },
        },
      },
      GraphQLResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                locations: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
                path: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
      BatchResponse: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                response: {
                  $ref: '#/components/schemas/HTTPResponse',
                },
                error: {
                  type: 'string',
                },
              },
            },
          },
          totalTime: {
            type: 'number',
            description: 'Total execution time in milliseconds',
          },
        },
      },
      OAuthToken: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
          },
          tokenType: {
            type: 'string',
          },
          expiresIn: {
            type: 'integer',
          },
          refreshToken: {
            type: 'string',
          },
          scope: {
            type: 'string',
          },
        },
      },
    },
  },
};

/**
 * Buying Agent Tool - Automated purchase agent
 * MCP tool for finding products, comparing prices, and making purchases
 */
export const buyingAgentSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Buying Agent Tool',
    version: '1.0.0',
    description: 'MCP tool for automated product search, price comparison, and purchase assistance',
  },
  servers: [
    {
      url: 'https://api.buying-agent.com/v1',
      description: 'Buying agent server',
    },
  ],
  paths: {
    '/products/search': {
      post: {
        summary: 'Search for products',
        operationId: 'searchProducts',
        tags: ['products'],
        description: 'Search for products across multiple retailers',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'Product search query',
                  },
                  category: {
                    type: 'string',
                    enum: ['electronics', 'clothing', 'home', 'books', 'toys', 'all'],
                    default: 'all',
                  },
                  minPrice: {
                    type: 'number',
                    description: 'Minimum price filter',
                  },
                  maxPrice: {
                    type: 'number',
                    description: 'Maximum price filter',
                  },
                  sortBy: {
                    type: 'string',
                    enum: ['relevance', 'price_low', 'price_high', 'rating'],
                    default: 'relevance',
                  },
                  limit: {
                    type: 'integer',
                    default: 20,
                    maximum: 100,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product search results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductSearchResults',
                },
              },
            },
          },
        },
      },
    },
    '/products/{productId}/compare': {
      get: {
        summary: 'Compare product prices',
        operationId: 'compareProductPrices',
        tags: ['products', 'comparison'],
        description: 'Compare prices for a product across retailers',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Price comparison results',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PriceComparison',
                },
              },
            },
          },
        },
      },
    },
    '/products/{productId}/reviews': {
      get: {
        summary: 'Get product reviews',
        operationId: 'getProductReviews',
        tags: ['products', 'reviews'],
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
          {
            name: 'limit',
            in: 'query',
            schema: {
              type: 'integer',
              default: 10,
            },
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['recent', 'helpful', 'rating_high', 'rating_low'],
              default: 'helpful',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Product reviews',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProductReviews',
                },
              },
            },
          },
        },
      },
    },
    '/deals/today': {
      get: {
        summary: 'Get todays deals',
        operationId: 'getTodaysDeals',
        tags: ['deals'],
        parameters: [
          {
            name: 'category',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['electronics', 'clothing', 'home', 'books', 'toys', 'all'],
              default: 'all',
            },
          },
          {
            name: 'minDiscount',
            in: 'query',
            schema: {
              type: 'integer',
              description: 'Minimum discount percentage',
              minimum: 0,
              maximum: 100,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Todays deals',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/DealsResults',
                },
              },
            },
          },
        },
      },
    },
    '/cart/add': {
      post: {
        summary: 'Add product to cart',
        operationId: 'addToCart',
        tags: ['cart'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'retailerId'],
                properties: {
                  productId: {
                    type: 'string',
                  },
                  retailerId: {
                    type: 'string',
                  },
                  quantity: {
                    type: 'integer',
                    default: 1,
                    minimum: 1,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product added to cart',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Cart',
                },
              },
            },
          },
        },
      },
    },
    '/recommendations': {
      post: {
        summary: 'Get product recommendations',
        operationId: 'getRecommendations',
        tags: ['recommendations'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['preferences'],
                properties: {
                  preferences: {
                    type: 'object',
                    properties: {
                      categories: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                      priceRange: {
                        type: 'object',
                        properties: {
                          min: {
                            type: 'number',
                          },
                          max: {
                            type: 'number',
                          },
                        },
                      },
                      brands: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    },
                  },
                  limit: {
                    type: 'integer',
                    default: 10,
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product recommendations',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Recommendations',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      ProductSearchResults: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
          },
          totalResults: {
            type: 'integer',
          },
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          currency: {
            type: 'string',
            default: 'USD',
          },
          retailer: {
            type: 'string',
          },
          imageUrl: {
            type: 'string',
            format: 'uri',
          },
          rating: {
            type: 'number',
            minimum: 0,
            maximum: 5,
          },
          reviewCount: {
            type: 'integer',
          },
          inStock: {
            type: 'boolean',
          },
          url: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      PriceComparison: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
          },
          productName: {
            type: 'string',
          },
          prices: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                retailer: {
                  type: 'string',
                },
                price: {
                  type: 'number',
                },
                shipping: {
                  type: 'number',
                },
                totalPrice: {
                  type: 'number',
                },
                inStock: {
                  type: 'boolean',
                },
                url: {
                  type: 'string',
                  format: 'uri',
                },
              },
            },
          },
          lowestPrice: {
            type: 'number',
          },
          bestRetailer: {
            type: 'string',
          },
        },
      },
      ProductReviews: {
        type: 'object',
        properties: {
          productId: {
            type: 'string',
          },
          averageRating: {
            type: 'number',
          },
          totalReviews: {
            type: 'integer',
          },
          reviews: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                rating: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 5,
                },
                title: {
                  type: 'string',
                },
                text: {
                  type: 'string',
                },
                author: {
                  type: 'string',
                },
                date: {
                  type: 'string',
                  format: 'date',
                },
                helpful: {
                  type: 'integer',
                },
                verified: {
                  type: 'boolean',
                },
              },
            },
          },
        },
      },
      DealsResults: {
        type: 'object',
        properties: {
          deals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: {
                  $ref: '#/components/schemas/Product',
                },
                originalPrice: {
                  type: 'number',
                },
                discountPercentage: {
                  type: 'integer',
                },
                savings: {
                  type: 'number',
                },
                expiresAt: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
      },
      Cart: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                product: {
                  $ref: '#/components/schemas/Product',
                },
                quantity: {
                  type: 'integer',
                },
                subtotal: {
                  type: 'number',
                },
              },
            },
          },
          total: {
            type: 'number',
          },
          itemCount: {
            type: 'integer',
          },
        },
      },
      Recommendations: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
          },
          reason: {
            type: 'string',
            description: 'Why these products were recommended',
          },
        },
      },
    },
  },
};

/**
 * Agent Browser Tool - Browser automation via MCP
 * MCP tool for automating browser interactions, testing, and data extraction
 */
export const agentBrowserSpec: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Agent Browser Tool',
    version: '1.0.0',
    description: 'MCP tool for automating browser interactions, web testing, form filling, screenshots, and data extraction',
  },
  servers: [
    {
      url: 'https://api.agent-browser.com/v1',
      description: 'Agent Browser MCP Server',
    },
  ],
  paths: {
    '/browser/open': {
      post: {
        summary: 'Navigate to a URL',
        operationId: 'browserOpen',
        tags: ['navigation'],
        description: 'Open a browser and navigate to the specified URL',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: {
                    type: 'string',
                    format: 'uri',
                    description: 'The URL to navigate to',
                  },
                  sessionId: {
                    type: 'string',
                    description: 'Browser session ID for multi-session support',
                  },
                  headed: {
                    type: 'boolean',
                    default: false,
                    description: 'Show browser window (headed mode)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully navigated to URL',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/snapshot': {
      post: {
        summary: 'Get page snapshot',
        operationId: 'browserSnapshot',
        tags: ['analysis'],
        description: 'Get accessibility tree snapshot with interactive elements and refs',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  interactive: {
                    type: 'boolean',
                    default: true,
                    description: 'Return only interactive elements',
                  },
                  compact: {
                    type: 'boolean',
                    default: false,
                    description: 'Use compact output format',
                  },
                  depth: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 10,
                    description: 'Maximum tree depth',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Page snapshot with element refs',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SnapshotResult',
                },
              },
            },
          },
        },
      },
    },
    '/browser/click': {
      post: {
        summary: 'Click an element',
        operationId: 'browserClick',
        tags: ['interaction'],
        description: 'Click an element by reference from snapshot',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ref'],
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  ref: {
                    type: 'string',
                    description: 'Element reference (e.g., @e1)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully clicked element',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/fill': {
      post: {
        summary: 'Fill an input field',
        operationId: 'browserFill',
        tags: ['interaction'],
        description: 'Clear and fill an input field with text',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ref', 'text'],
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  ref: {
                    type: 'string',
                    description: 'Element reference',
                  },
                  text: {
                    type: 'string',
                    description: 'Text to fill',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successfully filled field',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/screenshot': {
      post: {
        summary: 'Take a screenshot',
        operationId: 'browserScreenshot',
        tags: ['capture'],
        description: 'Capture a screenshot of the current page',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  fullPage: {
                    type: 'boolean',
                    default: false,
                    description: 'Capture full page',
                  },
                  path: {
                    type: 'string',
                    description: 'File path to save screenshot',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Screenshot captured',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ScreenshotResult',
                },
              },
            },
          },
        },
      },
    },
    '/browser/wait': {
      post: {
        summary: 'Wait for element or condition',
        operationId: 'browserWait',
        tags: ['control'],
        description: 'Wait for an element, time, or page condition',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  ref: {
                    type: 'string',
                    description: 'Element reference to wait for',
                  },
                  milliseconds: {
                    type: 'integer',
                    description: 'Time to wait in milliseconds',
                  },
                  text: {
                    type: 'string',
                    description: 'Text content to wait for',
                  },
                  load: {
                    type: 'string',
                    enum: ['load', 'domcontentloaded', 'networkidle'],
                    description: 'Page load state to wait for',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Wait completed',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/state/save': {
      post: {
        summary: 'Save browser state',
        operationId: 'browserStateSave',
        tags: ['state'],
        description: 'Save cookies, localStorage, and sessionStorage',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['path'],
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  path: {
                    type: 'string',
                    description: 'File path to save state',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'State saved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/state/load': {
      post: {
        summary: 'Load browser state',
        operationId: 'browserStateLoad',
        tags: ['state'],
        description: 'Load previously saved browser state',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['path'],
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  path: {
                    type: 'string',
                    description: 'File path to load state from',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'State loaded successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/BrowserResponse',
                },
              },
            },
          },
        },
      },
    },
    '/browser/get': {
      post: {
        summary: 'Get element information',
        operationId: 'browserGet',
        tags: ['query'],
        description: 'Get text, value, title, or URL',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['property'],
                properties: {
                  sessionId: {
                    type: 'string',
                  },
                  property: {
                    type: 'string',
                    enum: ['text', 'value', 'title', 'url'],
                    description: 'Property to retrieve',
                  },
                  ref: {
                    type: 'string',
                    description: 'Element reference (required for text/value)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Property value',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      BrowserResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
          sessionId: {
            type: 'string',
          },
        },
      },
      SnapshotResult: {
        type: 'object',
        properties: {
          elements: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ElementRef',
            },
          },
          tree: {
            type: 'string',
            description: 'Accessibility tree as text',
          },
          url: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
        },
      },
      ElementRef: {
        type: 'object',
        properties: {
          ref: {
            type: 'string',
            description: 'Element reference (e.g., @e1)',
          },
          type: {
            type: 'string',
            description: 'Element type (button, textbox, etc.)',
          },
          name: {
            type: 'string',
            description: 'Element name or label',
          },
          text: {
            type: 'string',
            description: 'Element text content',
          },
        },
      },
      ScreenshotResult: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          path: {
            type: 'string',
            description: 'File path where screenshot was saved',
          },
          data: {
            type: 'string',
            format: 'byte',
            description: 'Base64 encoded image data',
          },
        },
      },
    },
  },
};

/**
 * All available demo specs - MCP Tool Examples
 */
export const demoSpecs = {
  webSearch: {
    name: 'Web Search Tool',
    description: 'Search the web, news, and images using various search engines',
    spec: webSearchSpec,
  },
  computerUse: {
    name: 'Computer Use Tool',
    description: 'Control computer operations, execute commands, and automate tasks',
    spec: computerUseSpec,
  },
  browserUse: {
    name: 'Browser Use Tool',
    description: 'Automate web browsers, scrape data, and interact with web pages',
    spec: browserUseSpec,
  },
  apiCalling: {
    name: 'API Calling Tool',
    description: 'Make HTTP requests to external APIs with auth and data transformation',
    spec: apiCallingSpec,
  },
  buyingAgent: {
    name: 'Buying Agent Tool',
    description: 'Search products, compare prices, and assist with purchases',
    spec: buyingAgentSpec,
  },
  agentBrowser: {
    name: 'Agent Browser Tool',
    description: 'Automate browser interactions for testing, form filling, screenshots, and data extraction',
    spec: agentBrowserSpec,
  },
} as const;

export type DemoSpecKey = keyof typeof demoSpecs;
