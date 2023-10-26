const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Project': ['Nation']
};

module.exports = {
    name: 'Province',
    define: (sequelize) => {
        sequelize.define('Province', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
            },
            id_nation: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Nations', // Nombre del modelo de Empresa
                    key: 'id' // Clave primaria en el modelo de Empresa
                }
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }
        });
    }
}