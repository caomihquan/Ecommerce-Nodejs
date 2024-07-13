'use strict'

const {clothes,electronic,furniture,product} = require('../models/product.model')
const { BadRequestError } = require("../core/error.response")
const { 
    findAllDraftsForShop,publishProductByShop,
    searchProductByUser ,findAllProducts,updateProductById
}= require('../models/repositories/product.repo')
const { updateNestedObjectParse,removeUndefinedObject } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')


class ProductFactoryV2{
    static productRegistry = {}
    static registerProductType(type,classRef){
        ProductFactoryV2.productRegistry[type] = classRef
    }
    static async createProduct(type,payload){
        const ProductClass = ProductFactoryV2.productRegistry[type]
        if(!ProductClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new ProductClass(payload).createProduct();
    }

    static async updateProduct(type,productId,payload){
        const ProductClass = ProductFactoryV2.productRegistry[type]
        if(!ProductClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new ProductClass(payload).updateProduct(productId);
    }


    static async publishProductByShop({product_shop,product_id}){
        const shop = await publishProductByShop({product_shop,product_id})
    }

    static async findAllDraftsForShop({product_shop,limit=50,skip=0}){
        const query = {product_shop,isDraft:true}
        return await findAllDraftsForShop(query,limit,skip)
    }

    static async findAllPublishedForShop({product_shop,limit=50,skip=0}){
        const query = {product_shop,isPublished:true}
        return await findAllDraftsForShop(query,limit,skip)
    }

    static async searchProduct({keysearch}){
        return await searchProductByUser({keysearch})
    }

    static async findAllProducts({limit = 50,sort='ctime',page=1,filter={isPublished:true}}){
        return await findAllProducts({limit,sort,page,filter,
            select:['product_name','product_price','product_thumb']
        })
    }
}

class Product{
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id){
        const newProduct = await product.create({...this,id:product_id})
        if(newProduct){
            await insertInventory({
                productId:product_id,
                shopId:this.product_shop,
                stock:this.product_quantity
            })
        }

    }

    async updateProduct(productId,bodyUpdate){
        return await product.findByIdAndUpdate(productId,bodyUpdate,{
            new:true
        });
    }
}

class Clothing extends Product{
    async createProduct(){
        const newClothing = await clothes.create({
            ...this.product_attributes,
            product_shop:this.product_shop
        })
        if(!newClothing) throw new BadRequestError(`create new Clothing error`)
        const newProduct = await super.createProduct(newClothing._id);
        if(!newProduct) throw new BadRequestError(`create new Product error`)
        
        return newProduct;

    }

    async updateProduct(productId){
        //1.remove attr has null underfined
        const updateNest = updateNestedObjectParse(this);
        const objectParams = removeUndefinedObject(updateNest);
        //2.check where need to update
        if(objectParams.product_attributes){
            //update child
            await updateProductById(productId,objectParams,clothes)
        }
        const updateProduct = await super.updateProduct(productId,objectParams);
        return updateProduct;
    }
}

class Electronics extends Product{
    async createProduct(){
        const newElectronic = await electronic.create(
            {
                ...this.product_attributes,
                product_shop:this.product_shop
            }
        )
        if(!newElectronic) throw new BadRequestError(`create new Clothing error`)
        const newProduct = await super.createProduct(newElectronic._id);
        if(!newProduct) throw new BadRequestError(`create new Product error`)
        
        return newProduct;

    }
}

class Furnitures extends Product{
    async createProduct(){
        const newFurniture = await furniture.create(
            {
                ...this.product_attributes,
                product_shop:this.product_shop
            }
        )
        if(!newFurniture) throw new BadRequestError(`create new newFurniture error`)
        const newProduct = await super.createProduct(newFurniture._id);
        if(!newProduct) throw new BadRequestError(`create new Product error`)
        
        return newProduct;

    }
}
ProductFactoryV2.registerProductType('Electronics',Electronics)
ProductFactoryV2.registerProductType('Clothing',Clothing)
ProductFactoryV2.registerProductType('Furnitures',Furnitures)
module.exports = ProductFactoryV2