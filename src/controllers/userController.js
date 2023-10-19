const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../DB_connection');
const { SECRET }= require('../config.js')

const createUser = async (req, res) => {
    const { username, email, password, type } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            type,
            state: false
        });


        
        res.status(201).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error al crear el usuario", error : error.message});
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).send({ message: 'Usuario o contraseña incorrectos.' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send({ message: 'Usuario o contraseña incorrectos.' });
        }
        const token = jwt.sign({ userId: user.id, type: user.type }, SECRET, {
            expiresIn: '1h' // Sesion dura una hora, *investigar opciones de la duracion de la session (para siempre, por largo tiempo, o por actividad)
        });
        res.send({ token, user });
    } catch (error) {
        res.status(500).send({ message: 'Error al iniciar sesión.', error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            user.state = false;
            await user.save(); 
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    login
};