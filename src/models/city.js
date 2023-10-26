const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Project': ['Province']
};

module.exports = {
    name: 'City',
    define: (sequelize) => {
        sequelize.define('City', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4, // Puedes usar una función para generar UUIDs aleatorios
                allowNull: false
            },
            id_province: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Provinces', // Nombre del modelo de Empresa
                    key: 'id' // Clave primaria en el modelo de Empresa
                }
            },
            city: {
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