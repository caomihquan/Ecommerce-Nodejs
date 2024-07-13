'use strict'

const {model,Schema} = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product'
const slugify = require('slugify')
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
const ProductSchema = new Schema({
    product_name:{type:String,required:true},
    product_thumb:{type:String,required:true},
    product_description:{type:String},
    product_slug:{type:String},
    product_price:{type:Number,required:true},
    product_quantity:{type:Number,required:true},
    product_type:{type:String,required:true,enum:['Electronics','Clothing','Furniture']},
    product_shop:{type:Schema.Types.ObjectId,ref:'User'},
    product_attributes:{type:Schema.Types.Mixed,required:true},
    product_ratingsAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be greater than 1.0'],
        max:[5,'Rating must be lesser than 5.0'],
        set:(val) => Math.round(value * 10) / 10
    },
    product_variations:{type:Array,default:[]},
    isDraft:{type:Boolean,default:true,index:true,select:false},
    isPublished:{type:Boolean,default:false,index:true,select:false},

},{
    timestamps:true,
    collection:COLLECTION_NAME
});
//Document middleware: run before save and create
ProductSchema.pre('save',function(next){
    this.product_slug = slugify(this.product_name,{lower:true})
    next()
})
//create index for search
ProductSchema.index({product_name:'text',product_description:'text'})
const electronicSchema = new Schema({
    manufacturer:{type:String,required:true},
    model:{type:String},
    color:{type:String},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},
},{
    timestamps:true,
    collection:'electronic'
}); 

const furnitureSchema = new Schema({
    manufacturer:{type:String,required:true},
    model:{type:String},
    color:{type:String},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},

},{
    timestamps:true,
    collection:'furniture'
}); 


const clothingSchema = new Schema({
    brand:{type:String,required:true},
    size:{type:String},
    material:{type:String},
    product_shop:{type:Schema.Types.ObjectId,ref:'Shop'},

},{
    timestamps:true,
    collection:'clothes'
}); 


//Export the model
module.exports = {
    product:model(DOCUMENT_NAME, ProductSchema),
    clothes:model('clothes', clothingSchema),
    furniture:model('furniture', furnitureSchema),
    electronic:model('electronic', electronicSchema),
}