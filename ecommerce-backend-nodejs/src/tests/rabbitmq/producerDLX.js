'use strict'
const amqp = require('amqplib')
const messages = 'new a product: Title absafds'

const runProducer = async() =>{
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'
        const notiQueue = 'notificationProcess'

        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

        //1.create Exchange

        await channel.assertExchange(notificationExchange,'direct',{
            durable:true
        })

        //2. create Queue

        const queueResult = await channel.assertQueue(notiQueue,{
            exclusive:false, // cho phep cac ket noi truy cap vao cung luc hang doi
            deadLetterExchange:notificationExchangeDLX,
            deadLetterRoutingKey:notificationRoutingKeyDLX
        })

        await channel.bindQueue(queueResult.queue,notificationExchange);

        const msg = 'a new product'

        await channel.sendToQueue(queueResult.queue,Buffer.from(msg),{
            expiration:'1000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500);

    } catch (error) {
        
    }
}

runProducer()