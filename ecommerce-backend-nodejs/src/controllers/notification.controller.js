'use strict'

const { listNotiByUser } = require("../services/notification.service");



class NotificationController{
    listNotiByUser = async(req,res,next) =>{
        new SuccessResponse({
            message:'listNotiByUser',
            metatdata:await listNotiByUser(req.body)
        }).send(res)
    }

}
module.exports = new NotificationController();