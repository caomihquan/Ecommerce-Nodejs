'use strict'

const { CREATED ,SuccessResponse} = require("../core/success.response");
const accessService = require("../services/access.service");


class AccessController {

    handlerRefeshToken = async(req,res,next) => {
        console.log(`[P]::handlerRefeshToken::`,req.body)
        // new SuccessResponse({
        //     message:'Get Token success!',
        //     metadata:await accessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)
        
        new SuccessResponse({
            message:'Get Token success!',
            metadata:await accessService.handlerRefreshTokenV2(
            {
                refreshToken:req.refreshToken,
                user:req.user,
                keyStore:req.keyStore
            })
        }).send(res)
    }

    logout = async(req,res,next) => {
            console.log(`[P]::logout::`,req.body)
            new SuccessResponse({
                message:'Logout success!',
                metadata:await accessService.logout(req.keyStore)
            }).send(res)
       
    }

    login = async(req,res,next) =>{
        try {
            console.log(`[P]::login::`,req.body)
            new SuccessResponse({
                metadata:await accessService.login(req.body),
            }).send(res)
        } catch (error) {
            
        }
    }

    signUp = async(req,res,next) =>{
        try {
            console.log(`[P]::signUp::`,req.body)
            new CREATED({
                message:'Regiserted OK!',
                metadata:await accessService.signUp(req.body),
                options:{
                    list:10
                }
            }).send(res)
            //return res.status(201).json()
        } catch (error) {
            
        }
    }
}

module.exports = new AccessController();