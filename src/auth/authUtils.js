'use strict'

const JWT = require('jsonwebtoken')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const asyncHandler = require('../helpers/asyncHandler')
const HEADER = {
    API_KEY:'x-api-key',
    CLIEND_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id'
}

const createTokenPair = async (payload,publicKey,privateKey) =>{
    try {
        const accessToken = await JWT.sign(payload,publicKey,{
            expiresIn:'2 days'
        })

        const refeshToken = await JWT.sign(payload,privateKey,{
            expiresIn:'7 days'
        })

        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err){
                console.error(`error verify::`,err)
            }
            else{
                console.log(`decode verify`,decode);
            }
        })

        return {accessToken, refeshToken}
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async(req,res,next)=>{
    const userId = req.headers[HEADER.CLIEND_ID]
    console.log(userId)
    if(!userId) throw new AuthFailureError('Invalid Request')
    
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')
    
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!keyStore) throw new AuthFailureError('Invalid Request')
    
    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserID')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error
    }

})

const authenticationV2 = asyncHandler(async(req,res,next)=>{
    const userId = req.headers[HEADER.CLIEND_ID]
    console.log(userId)
    if(!userId) throw new AuthFailureError('Invalid Request')
    
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found keyStore')
    
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken,keyStore.privateKey)
            if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserID')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!keyStore) throw new AuthFailureError('Invalid Request')
    
    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey)
        if(userId != decodeUser.userId) throw new AuthFailureError('Invalid UserID')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error
    }

})


const verifyJWT = async(token,keySecret)=>{
    return await JWT.verify(token,keySecret)
}

module.exports = {
    createTokenPair,
    authenticationV2,
    authentication,
    verifyJWT
}