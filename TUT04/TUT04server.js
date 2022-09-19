const http = require('http');
const path = require('path');
const fs = require('fs')
const fsPromises = require('fs').promises;


const logEvents = require('../Backend/logEvnets');
const EventEmitter = require('events');
class Emitter extends EventEmitter{};
// initialize object
const myEmitter  = new Emitter();
myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))


// Port initialization
const PORT = process.env.PORT || 3500;

const saveFile = async(filePath, contentType, response) =>{
    try{
        const rawData = await fsPromises.readFile(filePath, !contentType.includes('image') ? 'utf8' : '' );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200, 
            {'Content-Type': contentType})
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );
    } catch(err) {
        console.log(err);
        myEmitter.emit('log', `${err.name}: ${err.message}`, 'errorlog.txt')
        response.statusCode = 500;
        response.end();
    }
}

// Create a server 
const server = http.createServer((req, res) =>{
    console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqlog.txt')

    const extension = path.extname(req.url)


    // First Approach but not efficient method
    // let path;
    // if(req.url === '/' || req.url === "index.html"){
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     path = path.join(__dirname, 'views', 'index.html');
    //     fs.readFile(path, 'utf8',(err, data) =>{
    //         res.end(data)
    //     })
    // }

    let contentType;

    switch(extension){
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case 'png':
            contentType = 'image/png';
            break;
        case 'txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html'
    }

    let filePath = contentType === 'text/html' && req.url === '/'
                    ? path.join(__dirname, 'views', 'index.html')
                    // if '/' is the last chatacter in the url
                    : contentType === 'text/html' && req.url.slice(-1) === '/'
                        ? path.join(__dirname, 'views', req.url, 'index.html')
                        : contentType === 'text/html'
                            ? path.join(__dirname, 'view', req.url)
                            : path.join(__dirname, req.url)

    // Make .html extension not required in the browser
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';
    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        // call the save file path function
        saveFile(filePath, contentType, res)
    } else {
        // 404
        // 301 redirect
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301, {'location': '/ new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301,{'location': '/'});
                res.end();
                break;
            default:
                saveFile(path.join(__dirname), 'views', '404.html', res)
        }
    }


});
// Listen to the port
server.listen(PORT, () => console.log(`Server is running at ${PORT}`))






// add lister for the log event
// myEmitter.on('log', (msg) => logEvents(msg));
// setTimeout(() =>{
//     
//     myEmitter.emit('log', `Log event emitter`)
// }, 2000)