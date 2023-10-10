const express = require('express');
const router = require('./routes/index');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { conn } = require('./DB_connection');
const server = express();

server.use(morgan('dev'));
server.use(cors());
server.use(express.json());

// server.use('/rickandmorty', router);

server.listen(3001, async () => {
    console.log('Server listening at port 3001');
    await conn.sync({ alter: true });
    console.log('Database connected');
});

