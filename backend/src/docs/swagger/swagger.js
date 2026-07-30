import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';
import logger from '../../utils/logger.js';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Donor Dash API',
      version: '2.0.0',
      description: 'API documentation for Donor Dash application',
      contact: {
        name: 'Developer',
        email: 'info@donordash.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'jwt',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    path.resolve(__dirname, './routes/*.docs.js'),
    path.resolve(__dirname, './schemas/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Function to setup swagger in the express app
const setupSwagger = (app) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info('Swagger Docs available at /api-docs');
};

export default setupSwagger;
