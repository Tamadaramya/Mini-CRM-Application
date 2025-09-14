const express = require('express');
const {
  register,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;