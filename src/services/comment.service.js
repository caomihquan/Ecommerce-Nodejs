'use strict'

const Comment = require('../models/comment.model')
const { convertToObjectIdMongodb } = require('../utils')
const { NotFoundError } = require('../core/error.response')



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
}


module.exports = CommentService