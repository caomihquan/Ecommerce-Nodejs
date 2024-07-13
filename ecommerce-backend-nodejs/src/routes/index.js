'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

//checkAPIKey
//router.use(apiKey)

//check permission
//router.use(permission('0000'))


router.use('/v1/api/product',require('./product'))
router.use('/v1/api/comment',require('./comment'))
router.use('/v1/api/notification',require('./notification'))
router.use('/v1/api',require('./access'))

module.exports = router

