// $ export PORT=3003
// $ export MONGODB_URI="mongodb+srv://fullstack:PASSWORD@cluster0.txqus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// $ npm start
// $ nodemon --exec npm start

const config = require('./utils/config')
const express = require('express')
const app = express()

const cors = require('cors')

const blogsRouter = require('./controllers/blogs')

const middleware = require('./utils/middleware')

const logger = require('./utils/logger')

const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

//config.MONGODB_URI = "mongodb+srv://fullstack:PASSWORD@cluster0.txqus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB:', error.message)
  })

app.use(cors())

app.use(express.static('build'))

app.use(express.json())

app.use(middleware.requestLogger)

//app.use('/api/blogs', blogsRouter)
app.use(blogsRouter)

//app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app