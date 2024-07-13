'use strict'

const { connectToRabbitMQ, consumeQueue } = require('../dbs/init.rabbit')

const messageService = {
    consumerToQueue:async(queueName)=>{
        try {
            const {channel,connection} = await connectToRabbitMQ()
            await consumeQueue(channel,queueName)
        } catch (error) {
            console.error(`error service consumer`,error)
        }
    },
    //case processing
    consumerToQueueNormal:async() =>{
        try {
            const {channel,connection} = await connectToRabbitMQ()
            const notiQueue = 'notificationProcess'
            //1 Time To Live (TTL)
            // setTimeout(() => {
            //     channel.consume(notiQueue,msg=>{
            //         console.log(`SEND notificationQueue successfully processed`,msg.content.toString())
            //         channel.ack(msg)
            //     })
            // }, 12000);

            //2 .Loi logic
                channel.consume(notiQueue,msg=>{
                    try {
                        throw new Error('Errror Logic')
                        console.log(`SEND notificationQueue successfully processed`,msg.content.toString())
                        channel.ack(msg)
                    } catch (error) {
                        console.error(error)
                        channel.nack(msg,false,false)
                        /*
                            nack: negative acknowledge,
                            msg: thong tin
                            false: khong day vao hang doi ban dau
                            false: chi duy nhat mau tin hien tai
                        */
                    }
                  
                })
            
           
            
        } catch (error) {
            console.error(`error service consumer`,error)
        }
    },

    //case processing
    consumerToQueueFailed:async() =>{
        try {
            const notificationExchangeDLX = 'notificationExDLX'
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'
            const notiQueueHandler = 'notificationQueueHotFix'
            const {channel,connection} = await connectToRabbitMQ()

            await channel.assertExchange(notificationExchangeDLX,'direct',{
                durable:true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler,{
                exclusive:false
            })

            await channel.bindQueue(queueResult.queue,notificationExchangeDLX,notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue,msgFailed=>{
                console.log(`this notification error, pls hot fix::`, msgFailed.content.toString())
            },{
                noAck:true
            })


        } catch (error) {
            console.error(`error service consumer`,error)
        }
    }
}

module.exports = messageService;