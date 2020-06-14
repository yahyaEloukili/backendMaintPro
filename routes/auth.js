const express = require('express');
const { register, login, getMe, getUsers, resetPassword } = require('../controllers/auth');
const advancedResults = require('../middlewares/advancedResult');
const User = require('../Models/User');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/resetPassword', resetPassword);

module.exports = router;
