
'use strict'

const express = require('express');
const productController = require('../../controllers/product.controller');
const { authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router();


router.get('/search/:keySearch',asyncHandler(productController.searchProduct))
router.get('',asyncHandler(productController.findAllProduct))

router.use(authenticationV2)

//createProduct
router.post('',asyncHandler(productController.createProduct))
router.patch('/:productId',asyncHandler(productController.updateProduct))
router.post('/publish/:id',asyncHandler(productController.publishProduct))

//QUERY
router.get('/drafts/all',asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishedForShop))

module.exports = router