const { DataTypes } = require("sequelize");

const modelDependencies = {
    'Payment': ['User']
};

module.exports = {
    name: 'payment',
    define: (sequelize) => {
        sequelize.define('Payment', {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false
            },
            op_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            from: {
                type: DataTypes.UUID, // from_username
                allowNull: false,
                references: {
                    model: 'Users', // Nombre del modelo de usuario
                    key: 'id',      // Clave primaria en el modelo de usuario
                },
            },
            to: {
                type: DataTypes.UUID, //to_username
                allowNull: false,
                references: {
                    model: 'Users', // Nombre del modelo de usuario
                    key: 'id',      // Clave primaria en el modelo de usuario
                },
            },
            project: {
                type: DataTypes.UUID, // from_username
                allowNull: false,
                references: {
                    model: 'Projects', // Nombre del modelo de usuario
                    key: 'id',      // Clave primaria en el modelo de usuario
                },
            },
            transaction_amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            net_received_amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            /*currency_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },*/
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            payment_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            approved_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            state: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            }

        })
    }

};