const { version, description } = require('../../package.json');

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`

const swaggerDef = {
  openapi: "3.0.0",
  info: {
    title: "Transaction Payment Splitting Service API Documentation",
    description,
    "termsOfService": "http://swagger.io/terms/",
    "contact": {
          "name": "Obinna Franklin Duru",
          "email": "duruobinnafranklin@gmail.com"
      },
    version,
    license: {
      name: "MIT",
      url: "https://github.com/obinnafranklinduru/guessing_game/blob/main/LICENSE",
    },
    "host": BASE_URL,
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
};

module.exports = swaggerDef;