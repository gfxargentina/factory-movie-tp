const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Factory Movie API',
      description:
        'Skill Factory NodeJs: Proyecto Final de una tienda de alquiler de peliculas offline, con autenticacion/autorizacion y CRUD. Confirmacion de Cuenta de usuario por email.',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3002' }],
  },

  apis: [`${path.join(__dirname, './routes/*.js')} `],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
