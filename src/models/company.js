
const { DataTypes } = require('sequelize');

const data = {
    nombre: DataTypes.STRING,
    telefono: DataTypes.INTEGER,
    email: DataTypes.STRING,
    nacionalidad: DataTypes.INTEGER,
    idioma: DataTypes.ARRAY(DataTypes.INTEGER),
    horario: DataTypes.STRING,
    contacto: DataTypes.STRING
};

module.exports = (sequelize) => {
    const Company = sequelize.define('Company', {
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
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: data,            
            validate: {
                isValidData(value) {
                    if (
                        typeof value.nombre !== 'string' ||
                        typeof value.telefono !== 'number' ||
                        typeof value.email !== 'string' ||
                        typeof value.nacionalidad !== 'number' ||
                        typeof value.idioma !== 'objet' ||
                        typeof value.horario !== 'string' ||
                        typeof value.contacto !== 'string'
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
        },

        state: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    return Company;
};