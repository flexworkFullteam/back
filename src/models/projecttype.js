const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const projectType = sequelize.define('ProjectType', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        project_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    return projectType;
};