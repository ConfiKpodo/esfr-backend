    // swaggerOptions.js
    const swaggerJSDoc = require('swagger-jsdoc');

    const swaggerOptions = {
        swaggerDefinition: {
            openapi: '3.0.0',
            info: {
                title: 'My API',
                version: '1.0.0',
                description: 'API documentation for my Node.js project',
            },
            servers: [
                {
                    url: 'http://localhost:3000', // Adjust to your server's URL
                },
            ],
        },
        apis: ['./routes/*.js', './controllers/*.js'], // Paths to your API files with JSDoc comments
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    module.exports = swaggerSpec;