'use strict'


const {createComment, getCommentsByParentId} = require('../services/comment.service')

class CommentController{
    createComment = async(req,res,next) =>{
        new SuccessResponse({
            message:'create new comment',
            metatdata:await createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async(req,res,next) =>{
        new SuccessResponse({
            message:'create new comment',
            metatdata:await getCommentsByParentId(req.query)
        }).send(res)
    }
}
module.exports = new CommentController();