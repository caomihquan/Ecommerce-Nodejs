'use strict'

const { findById } = require("../services/apikey.service");

const HEADER = {
    API_KEY:'x-api-key',
    AUTHORIZATION:'authorization'
}

const apiKey = async(request,res,next) =>{

    try {
        const key = request.headers[HEADER.API_KEY]?.toString();
        if(!key){
            return res.status(403).json({
                message:'Forbidden Error'
            })
        }

        const objKey = await findById(key);
        if(!objKey){
            return res.status(403).json({
                message:'Forbidden Error'
            })
        }

        request.objKey = objKey;
        return next();


    } catch (error) {
        
    }

}

const permission = (permission) =>{
    return (req,res,next) => {
        if(!req.objKey.permissions){
            return res.status(403).json({
                message:'permission denied'
            })
        }
        console.log('permission::',permission);

        const validPermision = req.objKey.permissions.includes(permission);
        if(!validPermision){
            return res.status(403).json({
                message:'permission denied'
            })
        }
        
        return next();
    }
}


module.exports = {
    apiKey,permission
}