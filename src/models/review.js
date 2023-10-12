const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isRange(valor) {
                    if (valor > 5 || valor < 1)
                        throw new Error("Rango de valoracion debe estar dentro de 1 y 5");
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Nombre del modelo de Empresa
                key: 'id' // Clave primaria en el modelo de Empresa
            }
        }
    });
    return review;
};