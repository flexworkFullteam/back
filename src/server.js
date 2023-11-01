/*// Load environment variables from .env file
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
    res.header('Access-Control-Allow-Origin', FRONT_URL);
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
        await conn.sync();
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
tryConnect();*/

require('dotenv').config();
const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { conn } = require('./DB_connection');
const server = express();


server.use(morgan('dev'));
//server.use(cors());
server.use(express.json());
server.use(cookieParser());
server.options('*', cors());

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza esto con tu dominio de frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    credentials: true, // Habilita las credenciales
};

server.use(cors(corsOptions));

server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use((req, res, next) => {
    //res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

server.use('/', routes);

server.listen(3001, async () => {
    console.log('Server listening at port 3001');
    await conn.sync({ alter: true });
    console.log('Database connected');
});