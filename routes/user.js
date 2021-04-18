const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const rateLimit = require("express-rate-limit");

const accountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 6 requests per windowMs
    message: "Trop de tentative, réessayer dans 15 minutes"
});

router.post('/signup', userCtrl.signup);
router.post('/login', accountLimiter, userCtrl.login)

module.exports = router;