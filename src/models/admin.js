const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Admin': ['User', 'Nationality']
};

module.exports = {
    name: 'Admin',
    define: (sequelize) => {
        const Admin = sequelize.define('Admin', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                }
            },
            state: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

        });
        return Admin;
    }

};