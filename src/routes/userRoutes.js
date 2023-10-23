const { Router } = require('express');
const userController = require('../controllers/userController');
const router = Router();

router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUsers);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/user/login', userController.login);
router.post('/user/verifyemail', userController.verifyemail);

module.exports = router;
