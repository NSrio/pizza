const express = require('express')
const app = express()
const PORT = process.env.PORT || 3300
const ejs = require ('ejs')
const expressLayout = require ('express-ejs-layouts')
const path = require('path')


app.get('/', (req,res) => {
    res.render('home')
})

// set Templete engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')


app.listen(PORT,()=>
{
    console.log(`Listening on port ${PORT}`)
})