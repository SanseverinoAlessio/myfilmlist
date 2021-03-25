const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.js');
var path = require('path');
const isAdmin = require('../middleware/isAdmin.js');
router.delete('/delete',authController.removeAccount);
router.put('/updateInformation',authController.updateInformation);
router.put('/updatePassword',authController.updatePassword);
router.put('/updateAvatar',authController.updateAvatar);
router.delete('/removeAvatar',authController.removeAvatar);
router.get('/getAccountInfo',authController.getAccountInfo);
router.get('/isadmin',isAdmin(),authController.isAdmin);

module.exports = router;
