
'use strict'

const express = require('express');
const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router();

router.use(authenticationV2)

//createProduct
router.get('',asyncHandler(notificationController.listNotiByUser))

module.exports = router