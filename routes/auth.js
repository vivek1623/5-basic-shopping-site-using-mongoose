const express = require('express');

const authController = require('../controllers/auth');
const validatorMiddleware = require('../middlewares/validator')

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', validatorMiddleware.signup, authController.postSignup);

router.get('/login',  authController.getLogin);

router.post('/login', validatorMiddleware.login, authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/reset-password', authController.getResetPassword)

router.post('/reset-password', authController.postResetPassword)

router.get('/reset-password/:token', authController.getUpdatePassword)

router.post('/update-password', authController.postUpdatePassword)

module.exports = router;