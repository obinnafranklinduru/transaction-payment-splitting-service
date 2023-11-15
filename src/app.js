const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');

const errorHandler = require('./middlewares/error.middleware');
const limiter = require('./middlewares/rateLimiter.middleware');
const routes = require('./routes/v1');

const app = express();

// Security Middlewares Configuration
app.use(helmet()); // set security HTTP headers
app.use(express.json()); // parse json request body
app.use(express.urlencoded({ extended: true })); // parse urlencoded request body
app.use(compression()); // gzip compression
app.use(limiter); // Apply the rate limiting middleware to all requests
app.use(cors()); // Enables Cross-Origin Resource Sharing (CORS) for all routes.
app.options('/*', cors()); // Handles HTTP OPTIONS requests for all routes, apply CORS headers.
app.use(morgan('combined')); // Configures server to log requests using the 'combined' format.

// v1 API routes
app.use('/', routes);
app.use('/*', function (req, res) {
    res.json({
        success: false,
        message: "Route not found!"
    })
});

// Error Handler Middleware
app.use(errorHandler);

module.exports = app;