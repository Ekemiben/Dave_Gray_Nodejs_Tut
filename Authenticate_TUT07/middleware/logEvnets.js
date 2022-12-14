const {format} = require('date-fns')
const {v4:uuid} =require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName)=>{
    const datTime = `${format(new Date(), 'yyyMMdd\tHH:mm:ss')}`
    const logItem = `${datTime}\t${uuid()}\t${message}\n`
    console.log(logItem);
    try{
        if(!fs.existsSync(path.join(__dirname, '..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'logName.txt'), logItem);
    }catch(err){
        console.log(err)
    }
}

const logger = (req, res, next) =>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`)
    console.log(`${req.method} ${req.path}`,  'reqLog.txt')
    next()
}
// console.log(new Date(), 'yyyMMdd\tHH:mm:ss')
// console.log(uuid())

module.exports = {logger, logEvents};