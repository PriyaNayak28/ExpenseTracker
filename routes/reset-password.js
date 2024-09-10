const express = require('express');

const resetpasswordController = require('../controllers/reset-password');

const router = express.Router();

router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/resetpassword/:id', resetpasswordController.resetpassword)

router.post('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;