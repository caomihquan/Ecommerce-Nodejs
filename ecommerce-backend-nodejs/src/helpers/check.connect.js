const mongoose = require("mongoose");
const os = require('os')
const process = require('process')

const countConnect = () =>{
    const numConnect = mongoose.connections.length;
    console.log(`Number of connection ${numConnect}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss
        const corePC = 4;
        const maxConnection = numCores * corePC

        console.log(`Active cnn: ${numConnect}`);
        console.log(`memoryUsage: ${memoryUsage}`);

        if(numConnect > maxConnection){
            console.log(`cnn overload`);
        }
    }, 5000);
}

module.exports = {
    countConnect
}