const { DataTypes } = require("sequelize");

module.exports = {
    name: 'ProjectFields',
    define: (sequelize) => {
        sequelize.define('ProjectFields', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            project_fields: {
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