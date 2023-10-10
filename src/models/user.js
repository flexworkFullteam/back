const { conn } = require('../DB_connection'); 
const { DataTypes } = require('sequelize');

const User = conn.define('User', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
        isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tipe:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    state:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

module.exports = User;

