const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Review': ['User']
};

module.exports = {
    name: 'Review',
    define: (sequelize) => {
        sequelize.define('Review', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
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
            review_by: { // ID del usuario que esta haciendo el review
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            id_user: {  // ID del usuario al que se le va a hacer el review
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users', // Nombre del modelo de Empresa
                    key: 'id' // Clave primaria en el modelo de Empresa
                }
            }
        });
    }
}