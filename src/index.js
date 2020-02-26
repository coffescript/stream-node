'use strict'

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

//database
require('./database/database')

const tracksRoutes = require('./routes/tracks.routes')

//initialize app
const app = express()

//middlewares
app.use(morgan('dev'))
app.use(cors())

//routes
app.use(tracksRoutes)

app.listen(3000);
console.log('Server on port 3000')