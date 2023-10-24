const { Router } = require('express');
const userController = require('../controllers/userController');
//---------------   Auth0
const userAuth0Middleware = require('../middlewares/userAuth0Middleware');
const userAuth0Controller = require('../controllers/userAuth0Controller');
//---------------
const router = Router();

router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUsers);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/user/login', userController.login);
//---------------   Auth0
router.post('/user/auth0/loginOrSignup', userAuth0Middleware, userAuth0Controller.loginOrSignup);
//--------------- 
module.exports = router;
