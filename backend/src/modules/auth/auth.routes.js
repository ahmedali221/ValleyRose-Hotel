const router = require('express').Router();
const { register, login, registerValidators, loginValidators } = require('./auth.controller');

router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);

module.exports = router;



