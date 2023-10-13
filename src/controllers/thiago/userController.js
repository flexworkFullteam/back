const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// JWT Middleware para protejer rutas
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};
// ------------------------------------------------

// Agregar un nuevo usuario
router.post('/', async (req, res) => {  
    const { username, email, password, type, state } = req.body;
    try {
        // Hash de la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.User.create({
            username,
            email,
            password: hashedPassword,
            type,
            state
        });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar el usuario' });
    }
});

// Ruta de inicio de session con generacion de JWT 
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.User.findOne({ where: { email } });
        if (!user) { 
            return res.status(404).json({ error: 'Usuario no encontrado' }) 
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) { 
            return res.status(400).json({ error: 'Contraseña incorrecta' }) 
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' }); // duracion de la session?, falta cambiar, no tocar
        res.json({ token, userId: user.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Obtener un usuario por ID
router.get('/:id',/*authenticateJWT,*/ async (req, res) => {  // <---  Ejemplo de ruta asegurada con JWT
    const id = req.params.id;

    try {
        const user = await db.User.findByPk(id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
});

// Actualizar un usuario por ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { username, email, password, type, state } = req.body;

    try {
        // Hash de la nueva contraseña antes de actualizarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRecord = await db.User.findByPk(id);
        if (userRecord) {
            await userRecord.update({
                username,
                email,
                password: hashedPassword,
                type,
                state
            });
            res.json({ message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const userRecord = await db.User.findByPk(id);
        if (userRecord) {
            await userRecord.destroy();
            res.json({ message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
});

module.exports = router;