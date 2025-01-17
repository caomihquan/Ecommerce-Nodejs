'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { discount } = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")

/*
    Discount Service
    1 - Generator Discount Code [Shop / Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [user]
*/

class DiscountService{
    static async createDiscountCode(payload){
        const {
            code,start_date,end_date,is_active,
            shopId,min_order_value,product_ids,applies_to,name,description,
            type,value,users_used,max_uses,uses_count,max_uses_per_user
        } = payload
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount has expired!')
        }

        if(new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('start date must before end date !')
        }

        //create index for discount code

        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongodb(shopId)
        }).lean();

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount exists')
        }

        const newDiscount = await discount.create({
            discount_name:name,
            discount_description:description,
            discount_type:type,
            discount_value:value,
            discount_code:code,
            discount_start_date:new Date(start_date),
            discount_end_date:new Date(end_date),
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_users_used:users_used,
            discount_max_uses_per_user:max_uses_per_user,
            discount_min_order:min_order_value || 0,
            discount_shopId:shopId,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids:applies_to == 'all' ? [] : product_ids,
        })
        return newDiscount;

    }

    static async updateDiscountCode(){

    }

    static async getAllDiscountCodesWithProduct({
        code,shopId,userId,limit,page
    }){
        const foundDiscount = await discount.findOne({
            discount_code:code,
            discount_shopId:convertToObjectIdMongodb(shopId)
        }).lean();

        if(!foundDiscount || !foundDiscount.discount_is_active){
            throw new NotFoundError('Discount not exists')
        }

        const {discount_applies_to,discount_product_ids} = foundDiscount
        let products;
        if(discount_applies_to == 'all'){
            products = await findAllProducts({
                filter:{
                    product_shop:convertToObjectIdMongodb(shopId),
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }
        if(discount_applies_to == 'specific'){
            products = await findAllProducts({
                filter:{
                    _id:{$in:discount_product_ids},
                    isPublished:true
                },
                limit:+limit,
                page:+page,
                sort:'ctime',
                select:['product_name']
            })
        }

        return product;
    }

    static async getAllDiscontCodeByShop(payload){
        //const discount = await findAllDi

    }
}