'use strict'

const {NOTI} = require("../models/notification.model")

const pushNotiToSystem = async({
    type = 'SHOP-001',
    recievedId = 1,
    senderId=1,
    options = {}
}) =>{
    let noti_content
    if(type == 'SHOP-001'){
        noti_content = '@@@ vừa mới thêm một sản phẩm: @@@'
    }
    else if(type == 'PROMOTION-001'){
        noti_content = '@@@ vừa mới thêm một voucher: @@@'
    }
    
    const newNoti = await NOTI.create({
        noti_type:type,
        noti_content:noti_content,
        noti_senderId:senderId,
        noti_recievedId:recievedId,
        noti_options:options
    })

    return newNoti;
}

const listNotiByUser = async({
    userId =1,
    type = 'All',
    isRead = 0
}) =>{
    const match = {noti_recievedId:userId}

    if(type !== 'All'){
        match['noti_type'] = type
    }

    return await NOTI.aggregate([
        {
            $match:match
        },
        {
            $project:{
                noti_type:1,
                noti_senderId:1,
                noti_recievedId:1,
                noti_content:1,
                createAt:1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}