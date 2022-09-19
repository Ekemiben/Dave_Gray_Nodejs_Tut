const logEvents = require('../logEvnets');

const EventEmitter = require('events');

class MyEmitter extends EventEmitter{};

// initialize object
const myEmitter  = new MyEmitter();

// add lister for the log event
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() =>{
    // Emit event
    myEmitter.emit('log', `Log event emitter`)
}, 2000)