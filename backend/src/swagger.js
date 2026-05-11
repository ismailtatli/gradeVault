const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GradeVault API',
      version: '1.0.0',
      description: 'Student Grade & Course Tracker REST API'
    },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options);