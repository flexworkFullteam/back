const { conn } = require('../DB_connection');
const { DataTypes } = require('sequelize');

const data = {
    nombre: "",
    telefono: "",
    email: "",
    nacionalidad: "",
    idioma: "",
    horario: "",
    contacto: ""
};

module.exports = () => {
    conn.define('company', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        razon_Social: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tipo_Actividad: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fecha_Inicio: {
            type: DataTypes.DATE,
            allowNull: false
        },
        domicilio_Fiscal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        representante_Legal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            nombre: DataTypes.JSONB,
            allowNull: false,
            defaultValue: data,
            validate: {
                isValidData(value) {
                    if (!Array.isArray(value))
                        throw new Error("Datos de contacto de la compañia deben ser un array");
                    for (const obj of value)
                        if (
                            typeof obj.nombre !== 'string' ||
                            typeof obj.telefono !== 'string' ||
                            typeof obj.email !== 'string' ||
                            typeof obj.nacionalidad !== 'string' ||
                            typeof obj.idioma !== 'string' ||
                            typeof obj.horario !== 'string' ||
                            typeof obj.contacto !== 'string'
                        )
                            throw new Error("Error: las propiedades deben ser string");
                }
            }
        },
        /*
        ESTE CAMPO DEBE SER ELABORADO CON UNA CONSULTA AL CREAR LOS CONTROLADORES

        RESEÑA:{
            id: tabla relacional
        }

        calificacion: {
            type: DataTypes.FLOAT,
            allowNull: false
        },*/
        cuenta_Banco: {
            type: DataTypes.FLOAT,
            allowNull: false
        }

    },
        { timestamps: false }
    );
};