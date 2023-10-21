const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Project': ['Nation']
};

module.exports = {
    name: 'Province',
    define: (sequelize) => {
        sequelize.define('Province', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            id_nation: {
                type: DataTypes.INTEGER,
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