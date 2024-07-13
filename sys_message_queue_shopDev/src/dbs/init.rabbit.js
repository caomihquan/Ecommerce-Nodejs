'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async() =>{
    try {
        const connection = await amqp.connect('amqp://localhost')
        if(!connection) throw new Error('connect RabbitMQ fail')

        const channel = await connection.createChannel();

        return {channel,connection}
    } catch (error) {
        
    }

}

const connectToRabbitMQForTest = async()=>{
    try {
        const {channel,connection} = await connectToRabbitMQ();

        const queue = 'test-queue'
        const message = 'Hello, shopDev by cmquan'

        await channel.assertQueue(queue)
        await channel.sendToQueue(queue,Buffer.from(message));

        await connection.close();
    } catch (error) {
        console.error(`error test rabbitMQ`, error)
    }
}
const consumeQueue = async(channel,queueName) =>{
    try {
        await channel.assertQueue(queueName,{durable:true})
        console.log(`Waiting for message...`)

        channel.consume(queueName,msg =>{
            console.log(`Receive message: ${queueName}:::`,msg.content.toString())
        },{
            noAck:true
        })
    } catch (error) {
        console.error(`errror consume`,error)
        throw error
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumeQueue
}