const { Router } = require('express');
const userController = require('../controllers/userController');
const userAuth0Middleware = require('../utils/auth0Middleware');
const userAuth0Controller = require('../controllers/userAuth0Controller');
const router = Router();

router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUsers);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/user/login', userController.login);
router.post('/user/auth0/loginOrSignup', userAuth0Middleware, userAuth0Controller.loginOrSignup);
router.post('/user/verifyemail', userController.verifyemail);

module.exports = router;
