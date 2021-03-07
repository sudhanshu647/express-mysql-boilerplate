const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'product_name APIs',
      version: '1.0.0',
      description:
        'Product_name REST full APIs documentation!',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/',
      },
      contact: {
        name: 'product_name Team',
        url: 'https://company_url.com',
        email: 'support@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/v1',
      },
      {
        url: 'http://your_production_server_api_url',
        description: 'Production server',
      },
    ],
  },
  apis: [
    './src/api/virtual/request/Auth.js',
    './src/api/virtual/response/Auth.js',
    './src/api/routes/v1/index.js',
    './src/api/routes/v1/auth.route.js',
  ],
};

const specs = swaggerJsdoc(options);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(specs, { explorer: true }));

module.exports = router;
