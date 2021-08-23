require('dotenv').config()     // to acess env file
const express = require('express')
const app = express()
const PORT = process.env.PORT || 9000
const ejs = require ('ejs')
const expressLayout = require ('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)

//Data connection

const url = 'mongodb://localhost/pizza';
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('Data connected...');
}).catch(err =>{
    console.log('connection failed...')
});

// Session store

let mongoStore = new MongoDbStore({
                    mongooseConnection: connection,
                    collection:'sessions'
})

// session config
app.use(session({
    secret: process.env.COOKIES_SECRET,         // to encrypt cookies use secret keyword
    resave : false,
    store: mongoStore,
    saveUninitialized:false,
    store :mongoStore,
    cookie :{ maxAge:1000*60*60*24}  // life duration of cookie                 
}))

app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// Global middleware

app.use((req,res,next)=>{
    res.locals.session = req.session
    next()
})

// set Templete engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


// Routes Settings

require('./routes/web.js')(app)

app.listen(PORT,()=>
{
    console.log(`Listening on port ${PORT}`)
})