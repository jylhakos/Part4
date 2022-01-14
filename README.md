# Node.js and Express

**The main entry**

Node.js attempts to load an index.js file in the directory.

The index.js file imports the actual application from the app.js file and then Node.js starts the application.

```

const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

```

The other parts of the application can access the environment variables by importing the configuration module.

```
const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)

```

**The environment variables**

The handling of environment variables is extracted into a utils/config.js file

```

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

```
**The metadata**

The package.json file contains metadata relevant to the project.

Use the npm init command to create a package.json file.

**The event handlers**

The event handlers of routes are commonly referred to as controllers.

The router is defined to use the URL of the request to start with /api/notes path.

The route handlers are defined in notes.js file.

```

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

```
**Express for Node.js**

```

$ npm install express --save

```

The express() function is a top-level function exported by the express module.

The app.js file contains the main configuration for the Express web application.

The app.js file that creates the actual application, takes the router into use in the following syntax.

The responsibility of establishing the connection to the database has been given to the app.js module. 

```

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

```

**Object modeling**

The note.js file under the models directory defines the Mongoose schema for notes.

Mongoose schema is a document data structure and provides a model for application data.

The notes collection contains notes that all have a user field that references a user in the users collection.

```

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)

```

**References across collections**

There is a one-to-many relationship between the user and notes.

We use object id's in Mongo to reference documents in other collections.

Since users can have many notes, the related object ids are stored in an array in the notes field.

We store the object ids of the notes created by the user in the user document.

We validate the uniqueness of the username using Mongoose validators.

```

const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User

```

**The controllers**

The object id of the note is stored in the notes field.

The information about the user who created a note is sent in the userId field of the request body.

Creating new notes is only possible if the HTTP POST request has a valid JWT token attached.

The object decoded from the JWT token contains the username and id fields.

If the identity of the sender of the request is resolved then the note is assigned to the user who created it.

```

const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => { 
  const notes = await Note
    .find({}).populate('user', { username: 1, name: 1 })

  response.json(notes.map(note => note.toJSON()))
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.json(savedNote.toJSON())
})
notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

module.exports = notesRouter

```

**The middleware**

The custom middleware is located in middleware.js module.

```

const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}

```
**Logger**

All printing is defined in module logger.js file.

```

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}

```

A link to Node.js modules.

https://nodejs.org/api/modules.html

A link to Express web framework.

https://expressjs.com/

**User authentication and authorization**

We install the bcrypt package to generate the password hashes.

```

$ npm install bcrypt

```
We store the hash of the password that is generated with the bcrypt.hash function.

```

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, date: 1 })
    
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter

```

**Token authentication**

React app sends the username and the password to the backend address /api/login as a HTTP POST request.

If the username and the password are correct, the backend generates a token which somehow identifies the logged in user.

The backend responds with a status code indicating the operation was successful, and returns the token with the response.

When the user does some operation requiring identification, the React code sends the token to the backend with the request.

```

$ npm install jsonwebtoken

```

The login functionality is implemented in login.js file.

The backend searches for the user from the database by the username attached to the request and it checks the password attached to the request.

The hashes calculated from the passwords are saved to the database.

The bcrypt.compare method is used to check if the password is correct.

If the user is not found, or the password is incorrect, then request is responded to with the status of unauthorized.

If the password is correct, then a JWT token is created and digitally signed.

```
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter

```

A link to JSON Web Tokens (JWT)

https://datatracker.ietf.org/doc/html/rfc7519

An example HTTP POST request with payload and JWT token by curl command.

```

$ curl -X "POST" http://localhost:3003/api/blogs -H "Content-Type: application/json" -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MGU5NjA0NzA3MTg2MDU0NTYzYmQ5ZmMiLCJpYXQiOjE2MjU5NjU4NDl9.UdJx2pAefZfdR_5JMjvtcNk-KtbgCJtjGmbloiPqq6c" -d "{\"title\":\"Canonical string reduction\", \"author\":\"Edsger W. Dijkstra\", \"url\":\"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html\", \"likes\":\"5\"}"

```

![alt text](https://github.com/jylhakos/Part4/blob/main/Part4.png?raw=true)

