// $ export PORT=3003
// $ export MONGODB_URI="mongodb+srv://fullstack:PASSWORD@cluster0.txqus.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// $ npm install --save-dev nodemon

// 4.1 
// $ npx nodemon --exec npm start

// 4.2 
// $ npm start

// 4.15
// $ npm install bcrypt

const config = require('./utils/config')

const express = require('express')

const app = express()

const cors = require('cors')

// 4.15
const usersRouter = require('./controllers/users')

const blogsRouter = require('./controllers/blogs')

// 4.18
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')

const logger = require('./utils/logger')

const mongoose = require('mongoose')

logger.info('Connecting to MongoDB', config.MONGODB_URI)

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

// 4.15
app.use(usersRouter)

//app.use('/api/blogs', blogsRouter)
// 4.1
app.use(blogsRouter)

// 4.18
app.use(loginRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app