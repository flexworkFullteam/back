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


const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(cors());
server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(cookieParser());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "https://front-virid-sigma.vercel.app/");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

server.use('/', routes);

server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//-------- db connection --------
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
        await conn.query('SELECT 1+1 AS result');
        next();
    } catch (error) {
        console.error('Database query failed:', error);
        retryConnection();
    }
});

// Initiate connection attempt
tryConnect();
