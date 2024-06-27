const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Port de Plaisance API',
      version: '1.0.0',
      description: 'API de gestion des réservations de catways'
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
