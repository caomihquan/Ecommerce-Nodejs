'use strict'

const {model,Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'


// Declare the Schema of the Mongo model
var notificationSchema = new Schema({
    noti_type:{type:String,require:true,enum:['ORDER-001','ORDER-002','PROMOTION-001','SHOP-001']},
    noti_senderId:{ type:Schema.Types.ObjectId,require:true,ref:'Shop'} ,
    noti_recievedId:{type:Number,require:true},
    noti_content:{type:String,require:true},
    noti_options:{type:Object,default:{}},

},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = {
    NOTI:model(DOCUMENT_NAME, notificationSchema)
}

