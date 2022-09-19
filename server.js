const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvnets')
const errorHandler = require('./middleware/errorHandler')
const verfyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cooki-parser')
const PORT = process.env.PORT || 3500;

// Custom middleware logger
app.use(logger)

app.use(cors(corsOptions))
// Middleware
// built-in middleware to handle urlencoded data and form data
app.use(express.urlencoded({extend: false}));

// built-in middleware for json
app.use(express.json());
// middleware for cookie
app.use(express.json())

// serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use(verfyJWT)
app.use('./employee', require('./routes/api/employees'))



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






