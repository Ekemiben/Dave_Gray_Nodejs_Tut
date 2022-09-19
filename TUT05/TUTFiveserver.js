const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');

const {logger} = require('./middleware/logEvnets')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;

// Custom middleware logger
app.use(logger)
// Cross Origin Resource Sharing
// app.use(cors())
const whitelist =[
    'https://www.yourdomainname.com', 
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
]
const corsOptions = {
    origin:(origin, callback) =>{
        if (whitelist.indexOf(origin) !==-1 || !origin ){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionSuccessStatus: 200
}

app.use(cors(corsOptions))
// Middleware
// built-in middleware to handle urlencoded data
// in other words, its handle form data submission
// content-type: applicationo/-www-form-urlencoded

app.use(express.urlencoded({extend: false}));

// built-in middleware for json
app.use(express.json());

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'))
app.use('/subdir', require('./routes/subdir'))
app.use('./employee', require('./routes/api/employees'))





// // Rout handlers
// app.get('/hello(.html)?', (req, res, next) =>{
//     console.log("attempted to load hello.html");
//     next()
// }, (req, res) =>{
//     res.send("Hello World!")
// })

// // Chaining Rout handlers
// const one = (req, res, next) =>{
//     console.log('one')
//     next()
// }
// const two = (req, res, next) =>{
//     console.log('two')
//     next()
// }
// const three = (req, res, next) =>{
//     console.log('three')
//     res.send("Finished!")
// }

// app.get('/chain(.html)?', [one, two, three])



// Default page rendering
app.all('*', (req, res) =>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 Not Found"})
    }else{
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

// Listen to the port
app.listen(PORT, () => console.log(`Server is running at ${PORT}`))






