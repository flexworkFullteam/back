const { Router } = require('express');
const userController = require('../controllers/userController');
const userAuth0Middleware = require('../utils/auth0Middleware');
const userAuth0Controller = require('../controllers/userAuth0Controller');
const updateAuth0UserTypeController = require('../controllers/updateAuth0UserTypeController')
const router = Router();

router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUsers);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.put('/user/password', userController.changePassword);
router.delete('/user/:id', userController.deleteUser);
router.post('/user/login', userController.login);

router.post('/user/auth0/loginOrSignup', userAuth0Middleware, userAuth0Controller.loginOrSignup);
router.put('/user/auth0/register', updateAuth0UserTypeController )

router.post('/user/verifyemail', userController.verifyemail);

module.exports = router;
