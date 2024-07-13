'use strict'
const mongoose = require('mongoose');
const {db:{host,name,port}} = require('../configs/config.mongodb')
const cnnString = `mongodb://${host}:${port}/${name}`

class Database{
    constructor(){
        this.connect();
    }

    connect(type = 'mongoose'){
        if(1===1){
            mongoose.set('debug',true),
            mongoose.set('debug',{color:true})
        }
        mongoose.connect(cnnString)
        .then(_ => console.log('Connected!'))
        .catch(err => console.log(`Error Connect ${err}`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }
        return Database.instance
    }
}
const instanceMongodb = Database.getInstance();


module.exports = instanceMongodb  