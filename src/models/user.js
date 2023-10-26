const { DataTypes } = require('sequelize');

module.exports = {
    name: 'User',
    define: (sequelize) => {
        const User = sequelize.define('User', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
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
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }, // 1 admin 2 profesional 3 empresa 4 Auth0 Placeholder
            auth0Id: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: true,
            },
            emailToken:{
                type: DataTypes.STRING
            },
            tc: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            validate: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }
        });
        return User;
    }
}
