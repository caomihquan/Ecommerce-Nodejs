'use strict'

const { connectToRabbitMQForTest } = require("../dbs/init.rabbit")

describe('RabbitMQ Connection',()=>{
    if('should connect to successful RabbitMQ',async()=>{
        const result = await connectToRabbitMQForTest();
        expect(result).toBeUndefined();
    }){}
})