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
const passport = require('passport')
const Emitter = require('events')

//Data connection


mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});
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


// Event emitter

const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)


// session config
app.use(session({
    secret: process.env.COOKIES_SECRET,         // to encrypt cookies use secret keyword
    resave : false,
    store: mongoStore,
    saveUninitialized:false,
    store :mongoStore,
    cookie :{ maxAge:1000*60*60*3}  // life duration of cookie                 
}))


// Passport config
const passportInit = require('./app/config/passport')

passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Assets
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// Global middleware to access data in fronted

app.use((req,res,next)=>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

// set Templete engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


// Routes Settings

require('./routes/web.js')(app)

const server = app.listen(PORT,()=>
{
    console.log(`Listening on port ${PORT}`)
})


// Socket 

const io = require('socket.io')(server)

io.on('connection',(socket)=>{
    //console.log(socket.id)
 

        socket.on('join',(roomName) => {

                //console.log(roomName)
                socket.join(roomName)
        })
}) 


eventEmitter.on('orderUpdated', (data) =>{
    io.to(`order_${data.id}`).emit('orderUpdated',data)     // send the upted data into socket for private room
})

eventEmitter.on('orderPlaced', (data) =>{
    io.to('adminRoom').emit('orderPlaced',data)     // send the upted data into socket for private room
})