const dev = {
    app:{
        port:3000
    },
    db:{
        host:'0.0.0.0',
        port:27017,
        name:'shopDEV'
    }
}

const pro = {
    app:{
        port:3000
    },
    db:{
        host:'0.0.0.0',
        port:27017,
        name:'shopDEV'
    }
}

const config = { dev , pro }
//const evn = process.env.NODE_ENV || 'dev'

module.exports = dev