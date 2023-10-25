const { Router } = require('express');
const userController = require('../controllers/userController');
<<<<<<< HEAD
//---------------   Auth0
const userAuth0Middleware = require('../utils/auth0Middleware');
=======
const userAuth0Middleware = require('../middlewares/userAuth0Middleware');
>>>>>>> 5ed0010a9d6a3ff6a7e0011d1546c9a171978b28
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
