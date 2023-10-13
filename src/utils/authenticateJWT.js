const jwt = require('jsonwebtoken');
const { SECRET } = require('../config.js'); 

function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;

/* funcion para proteger las rutas. llama la funcion al archivo de rutas y ponlo en la ruta, ejemplo:
const authenticateJWT = require('../middlewares/authenticateJWT');     <--- para importarla y 
router.put('/user/:id', authenticateJWT, userController.updateUser);   <--- para usarse
*/