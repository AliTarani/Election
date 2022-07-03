const asyncMiddleware = require('../middleware/async.middleware');
const express = require('express');
const router = express.Router();
const AuthController = require('../controller/auth.controller');

const {
  registerUser,
  loginUser
} = new AuthController();

router.post('/register', asyncMiddleware(registerUser));
router.post('/login', asyncMiddleware(loginUser));

module.exports = router;