'use strict'

const Comment = require('../models/comment.model')
const { convertToObjectIdMongodb } = require('../utils')
const { NotFoundError } = require('../core/error.response')
const { findProduct } = require('../models/repositories/product.repo')



class CommentService{
    static async createComment({
        productId,userId,content,parentCommentId = null
    }){
        const comment = new Comment({
            comment_productId:productId,
            comment_userId:userId,
            comment_content:content,
            comment_parentId:parentCommentId
        })
        let rightValue
        if(parentCommentId){
            //replyComment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment){
                throw new NotFoundError('parent comment not found')
            }
            rightValue = parentComment.comment_right;
            //updateMany comments

            await Comment.updateMany({
                comment_productId:convertToObjectIdMongodb(productId),
                comment_right:{$gte:rightValue}
            },{
                $inc:{comment_right:2}
            })
            await Comment.updateMany({
                comment_productId:convertToObjectIdMongodb(productId),
                comment_left:{$gt:rightValue}
            },{
                $inc:{comment_left:2}
            })

        }else{
            const maxRightValue = await Comment.findOne({
                comment_productId:convertToObjectIdMongodb(productId)
            },'comment_right',{sort:{comment_right:-1}})

            if(maxRightValue){
                rightValue = maxRightValue.right + 1
            }
            else{
                rightValue = 1
            }

            comment.comment_left = rightValue
            comment.comment_right = rightValue + 1

            await comment.save();
            return comment;
        }
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        litmit = 50, offset = 0
    }){
        if(parentCommentId){
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError('Not found comment for product')

            const comments = await Comment.find({
                comment_productId:convertToObjectIdMongodb(productId),
                comment_left:{$gt:parent.comment_left},
                comment_right:{$lt:parent.comment_right},
            }).sort({comment_left:1})    
            return comments;
        }

        const comments = await Comment.find({
            comment_productId:convertToObjectIdMongodb(productId),
            comment_parentId:parentCommentId
        }).sort({comment_left:1})   
    }

    static async deleteComment({commentId,productId}){
        const foundProduct = await findProduct({
            productId:productId
        })
        if(!foundProduct) throw new NotFoundError('product not found')

        //1. xac dinh left and right

        const foundComment = await Comment.findById(commentId)

        if(!foundComment) throw new NotFoundError('comment not found')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        //2. tinh widh

        const width = rightValue - leftValue + 1;

        //3. xoa tat ca commentId con

        await Comment.deleteMany({
            comment_productId:convertToObjectIdMongodb(commentId),
            comment_left:{$gte:leftValue,$lte:rightValue}
        })

        //4. cap nhat left and right con lai

        await Comment.updateMany({
            comment_productId:convertToObjectIdMongodb(commentId),
            comment_right:{$gt:rightValue}
        },{
            $inc:{comment_right:- width}
        })

        
        await Comment.updateMany({
            comment_productId:convertToObjectIdMongodb(commentId),
            comment_left:{$gt:leftValue}
        },{
            $inc:{comment_left:- width}
        })

        return true


    }
}


module.exports = CommentService