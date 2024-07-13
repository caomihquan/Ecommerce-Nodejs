'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError,AuthFailureError,ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP:'SHOP',
    WRITER:'WRITER',
    EDITOR:'EDITOR',
    ADMIN:'ADMIN'
}

class AccessService{


    static handlerRefreshTokenV2 = async({refreshToken,user,keyStore}) =>{
        
        const {userId,email} = user;
        if(keyStore.refreshTokenUsed.includes(refreshToken)){
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend !! please login again')
        }

        if(keyStore.refreshToken !== refreshToken){
            throw new AuthFailureError('Shop not registerted!')
        }

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registerted!')
        
        const tokens = await createTokenPair({userId:foundShop._id,email},keyStore.publicKey,foundToken.privateKey)

        await keyStore.updated({
            $set:{
                refreshToken:tokens.refeshToken
            },
            $addToSet:{
                refreshToken:refreshToken
            }
            
        })

        return {
            user,
            tokens
        }

    }

    //check token if used
    static handlerRefreshToken = async(refreshToken) =>{
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken){
            const {userId,email} = await verifyJWT(refreshToken,foundToken.privateKey)
            console.log({userId,email})
            await KeyTokenService.deleteKeyById(userId);
            throw new ForbiddenError('Something wrong happend !! please login again')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if(!holderToken) throw new AuthFailureError('Shop not registerted!')

        const {userId,email} = await verifyJWT(refreshToken,foundToken.privateKey);

        const foundShop = await findByEmail({email})
        if(!foundShop) throw new AuthFailureError('Shop not registerted!')
        
        const tokens = await createTokenPair({userId:foundShop._id,email},foundToken.publicKey,foundToken.privateKey)

        await holderToken.updated({
            $set:{
                refreshToken:tokens.refeshToken
            },
            $addToSet:{
                refreshToken:refreshToken
            }
            
        })

        return {
            user:{userId,email},
            tokens
        }

    }

    static logout = async(keyStore) =>{
        const delKey = await KeyTokenService.removeById(keyStore._id)
        console.log(`delKey`,{delKey});
        return delKey;    
    }   

    /*

    */
    static login = async({email,password,refreshToken = null}) =>{
        const foundShop = await findByEmail({email})
        if(!foundShop) throw new BadRequestError('Shop not found')

        const match = bcrypt.compare(password,foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication Failed')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({userId:foundShop._id,email},publicKey,privateKey)
        await KeyTokenService.createKeyToken({
            userId:foundShop._id,
            refreshToken:tokens.refeshToken,
            privateKey,
            publicKey
        })
        return {
            shop:getInfoData({fields:['_id','name','email'],object:foundShop}),
            tokens
        } 
    }

    static signUp = async({name,email,password}) => {
        try {
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                throw new BadRequestError(`Error: Shop already registered!`) 
            }
            const passwordHash = await bcrypt.hash(password,10)
            const newShop = await shopModel.create({
                name,email,password:passwordHash,roles:[RoleShop.SHOP]
            })

            if(newShop){
                // const { privateKey,publicKey } = crypto.generateKeyPairSync('rsa',{
                //     modulusLength:4096,
                //     publicKeyEncoding:{
                //         type:'pkcs1',
                //         format:'pem'
                //     },
                //     privateKeyEncoding:{
                //         type:'pkcs1',
                //         format:'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({privateKey,publicKey})

               
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // console.log(`publicKeyObject::`,publicKeyObject);
                const tokens = await createTokenPair({userId:newShop._id,email},publicKey,privateKey)
                console.log(`Created Token Success::`, tokens);

                await KeyTokenService.createKeyToken({
                    userId:newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken:tokens.refeshToken
                })

                // if(!publicKeyString){
                //     return {
                //         code:'xxx',
                //         message:'publicKeyString errror'
                //     }
                // }
                
                return {
                    code:201,
                    metadata:{
                        shop:getInfoData({fields:['_id','name','email'],object:newShop}),
                        tokens
                    }
                }
            }
            return {
                code:200,
                metadata:null
            }

        } catch (error) {
            return {
                code:'',
                message:error.message,
                status:'error'
            }
        }
    }
}

module.exports = AccessService;