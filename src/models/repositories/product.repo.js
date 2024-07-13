'use strict'

const {product,clothes,furniture,electronic} = require('../../models/product.model')
const {Types} = require('mongoose')
const { getSelectData } = require('../../utils')


const findAllDraftsForShop = async({query,limit,skip}) =>{
    return await product.find(query)
                        .populate('product_shop','name email -_id')
                        .sort({updateAt:-1})
                        .skip(skip)
                        .limit(limit)
                        .lean()
                        .exec()
}

const publishProductByShop = async({product_shop,product_id}) =>{
    const foundShop = await product.findOne({
        product_shop:new Types.ObjectId(product_shop),
        _id:new Types.ObjectId(product_id),
    })
    if(!foundShop) return null
    foundShop.isDraft = false;
    foundShop.isPublished = false;
    const {modifiedCount} = await foundShop.update(foundShop);

    return modifiedCount
}

const searchProductByUser = async({keySearch}) =>{
    const regexSearch = new RegExp(keySearch)
    const result = await product.find({
        $text:{$search:regexSearch}
    },{score:{$meta:'textScore'}})
    .sort({score:{$meta:'textScore'}})
    .lean();
    return result;
}

const findAllProducts = async({limit,sort,page,filter,select})=>{
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id:-1} : {_id:1}

    const products = await product.find(filter)
    .sortBy(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

    return products;

}

const updateProductById = async({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) =>{
    return await model.findByIdAndUpdate(productId,bodyUpdate,{
        new:isNew
    })
}


module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    searchProductByUser,
    findAllProducts,
    updateProductById
}