'use strict'

const {consumerToQueue, consumerToQueueNormal, consumerToQueueFailed} = require('./src/services/consumerQueue.service')

const queueName = 'test-topic'

// consumerToQueue(queueName).then(()=>{
//     console.log(`Message consumer start ${queueName}`)
// }).catch(err=>{
//     console.error(`Message error ${err.message}`)
// })

consumerToQueueNormal().then(()=>{
    console.log(`Message consumerToQueueNormal start ${queueName}`)
}).catch(err=>{
    console.error(`Message error ${err.message}`)
})
consumerToQueueFailed().then(()=>{
    console.log(`Message consumerToQueueFailed start ${queueName}`)
}).catch(err=>{
    console.error(`Message error ${err.message}`)
})