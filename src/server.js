require('dotenv').config();
const { AUTH0_DOMAIN, AUTH0_AUDIENCE } = process.env;
const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { conn } = require('./DB_connection');
const server = express();

// auth0
const { auth } = require('express-oauth2-jwt-bearer');
const port = process.env.PORT || 8080;
const jwtCheck = auth({
    audience: AUTH0_AUDIENCE,
    issuerBaseURL: AUTH0_DOMAIN,
    tokenSigningAlg: 'RS256'
});


server.use(morgan('dev'));
server.use(cors());
server.use(express.json());
server.use(cookieParser());


server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


server.use('/', routes);

server.listen(3001, async () => {
    console.log('Server listening at port 3001');
    await conn.sync({ force: true });
    console.log('Database connected');
});

