// 4.18
// $ npm install jsonwebtoken

const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')

const loginRouter = require('express').Router()

const User = require('../models/user')

// $ curl -X "POST" http://localhost:3003/api/login -H "Content-Type: application/json" -d "{\"username\":\"mluukkai\", \"password\":\"secret\"}"

loginRouter.post('/api/login', async (request, response) => {

  const body = request.body

  const user = await User.findOne({ username: body.username })

  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {

    return response.status(401).json({

      error: 'Invalid username or password'
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