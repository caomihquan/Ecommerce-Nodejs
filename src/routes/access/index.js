
const express = require('express');
const accessController = require('../../controllers/access.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();


// signUp
router.post('/shop/signup',asyncHandler (accessController.signUp))
//login
router.post('/shop/login',asyncHandler(accessController.login))
//Authentication

router.use(authenticationV2)

//logout
router.post('/shop/logout',asyncHandler(accessController.logout))

//handlerRefreshToken
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefeshToken))


module.exports = router