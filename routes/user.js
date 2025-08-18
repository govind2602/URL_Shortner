const express = require('express');
const { handleUserSignup, handleUserLogin } = require('../controllers/user'); // <-- Add handleUserLogin here
const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
const { handleUserLogout } = require('../controllers/user');

router.get('/logout', handleUserLogout);


module.exports = router;