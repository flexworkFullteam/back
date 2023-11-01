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
