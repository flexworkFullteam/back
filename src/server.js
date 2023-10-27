// Load environment variables from .env file
require('dotenv').config();
const { FRONT_URL } = process.env;

// Import required modules
const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { conn } = require('./DB_connection');
const helmet = require('helmet'); 

// Create an Express application
const server = express();

// Logging middleware for incoming requests
server.use(morgan('dev'));


// Security middleware to set various HTTP headers
server.use(helmet());

// CORS configuration for allowing requests only from specified domains
server.use(cors({
    origin: FRONT_URL,
    credentials: true,
}));

// Built-in middleware function to parse incoming requests with URL encoded payloads
server.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Built-in middleware function to parse incoming requests with JSON payloads
server.use(express.json({ limit: '50mb' }));

// Middleware to parse cookies from the request headers
server.use(cookieParser());

// Middleware to handle CORS pre-flight requests

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', FRONT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Middleware to handle application routes
server.use('/', routes);


// Centralized error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const maxAttempts = 60;
let attempts = 0;

const tryConnect = async () => {
    try {
        await conn.authenticate();
        console.log('Database connected successfully.');
        server.listen(3001, () => {
            console.log('Server listening at port 3001');
        });
    } catch (error) {
        retryConnection();
    }
};

const retryConnection = () => {
    attempts++;
    if (attempts < maxAttempts) {
        console.error(`Connection lost. Retrying (${attempts}/${maxAttempts})...`);
        setTimeout(tryConnect, 5000);
    } else {
        console.error('Max connection attempts reached. Exiting.');
        process.exit(1);
    }
};

server.use(async (req, res, next) => {
    try {
        // Example query to check the connection
        await conn.query('SELECT 1+1 AS result');
        next();
    } catch (error) {
        console.error('Database query failed:', error);
        retryConnection();
    }
});

// Initiate connection attempt
tryConnect();
