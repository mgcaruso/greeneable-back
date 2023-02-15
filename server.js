require('dotenv').config()
require('./config/database')
const path = require('path')

const cors = require('cors')
const passport = require('passport')
const Router = require('./routes/routes')
const express = require('express') 
const fileUpload = require('express-fileupload')
const app = express() 
const PORT =  process.env.PORT || 4000 

app.use(express.static(path.join(__dirname, 'storage')))
app.use(cors());
app.use(fileUpload())
app.use(express.json())
app.use(passport.initialize())
app.use('/api', Router)

app.listen(PORT, () => {
    console.log('SERVIDOR CORRIENDO EN PUERTO ' + PORT)
})