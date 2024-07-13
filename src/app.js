require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const {default:helmet} = require('helmet');
const compression = require('compression');
//init middlewares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
//init db
require('./dbs/init.mongodb')
//init routes
app.use('/',require('./routes/index'))

// handling error
app.use((req,res,next) =>{
    const err = new Error('NotFound')
    err.status = 404
    next(err)
})
app.use((err,req,res,next) =>{
    const statusCode = err.status || 500
    return res.status(statusCode).json({
        status:'error',
        code:statusCode,
        message:err.message || 'Internal Server'
    })
})

module.exports = app