const app = require("./src/app");

const PORT = process.env.PORT

const server = app.listen(PORT,()=>{
    console.log(`server start ${PORT}`)
})

process.on('SIGINT',()=>{
    server.close(()=>console.log('exist'));
})