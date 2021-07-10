// 4.15
const bcrypt = require('bcrypt')

const usersRouter = require('express').Router()

const User = require('../models/user')

const logger = require('../utils/logger')

// $ curl -X "POST" http://localhost:3003/api/users -H "Content-Type: application/json" -d "{\"username\":\"mluukkai\", \"name\":\"Matti Luukkainen\", \"password\":\"secret\"}"

// 4.15
usersRouter.post('/api/users', async (request, response) => {

  const body = request.body

  logger.info(body)

  console.log(body.username, body.user, body.password)

  const saltRounds = 10

  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  logger.info(savedUser)

  console.log('savedUser', savedUser)

  response.json(savedUser.toJSON())

})

// $ curl -X "GET" http://localhost:3003/api/users 

// 4.15
usersRouter.get('/api/users', async (request, response) => {
  const users = await User.find({})
  console.log(users)
  response.json(users.map(user => user.toJSON()))
})

module.exports = usersRouter