'use strict'

const { CREATED ,SuccessResponse} = require("../core/success.response");
const ProductFactory = require("../services/product.service");
const ProductFactoryV2 = require("../services/productV2.service");


class ProductController {
    //V1 not pattern
    // createProduct = async(req,res,next) => {
    //     console.log(`[P]::createProduct::`,req.body)
    //     new SuccessResponse({
    //         message:'createProduct success!',
    //         metadata:await ProductFactory.createProduct(req.body.product_type,{
    //             ...req.body,
    //             product_shop:req.user.userId
    //         })
    //     }).send(res)
   
    // }

    
    createProduct = async(req,res,next) => {
        console.log(`[P]::createProduct::`,req.body)
        new SuccessResponse({
            message:'createProduct success!',
            metadata:await ProductFactoryV2.createProduct(req.body.product_type,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)
   
    }

    updateProduct = async(req,res,next) => {
        console.log(`[P]::updateProduct::`,req.body)
        new SuccessResponse({
            message:'updateProduct success!',
            metadata:await ProductFactoryV2.updateProduct(
                req.body.product_type,req.params.productId,{
                ...req.body,
                product_shop:req.user.userId
            })
        }).send(res)
   
    }

    publishProduct = async(req,res,next) => {
        console.log(`[P]::publishProduct::`,req.body)
        new SuccessResponse({
            message:'publishProduct success!',
            metadata:await ProductFactoryV2.publishProductByShop({
                product_shop:req.user.userId,
                product_id:req.params.id
            })  
        }).send(res)
   
    }

   

    getAllDraftsForShop = async(req,res,next) =>{
        console.log(`[P]::getAllDraftsForShop::`,req.body)
        new SuccessResponse({
            message:'getAllDraftsForShop success!',
            metadata:await ProductFactoryV2.getAllDraftsForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }

    getAllPublishedForShop = async(req,res,next) =>{
        console.log(`[P]::getAllDraftsForShop::`,req.body)
        new SuccessResponse({
            message:'getAllPublishedForShop success!',
            metadata:await ProductFactoryV2.getAllPublishedForShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }

    searchProduct = async(req,res,next) =>{
        console.log(`[P]::searchProduct::`,req.body)
        new SuccessResponse({
            message:'searchProduct success!',
            metadata:await ProductFactoryV2.searchProduct(req.params)
        }).send(res)
    }

    findAllProduct = async(req,res,next) =>{
        console.log(`[P]::findAllProduct::`,req.body)
        new SuccessResponse({
            message:'findAllProduct success!',
            metadata:await ProductFactoryV2.findAllProducts(request.query)
        }).send(res)
    }
}

module.exports = new ProductController();