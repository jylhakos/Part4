// $ npm test -- tests/4.15.test.js

const mongoose = require('mongoose')

const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

const helper = require('../utils/list_helper')

const logger = require('../utils/logger')

const bcrypt = require('bcrypt')

const User = require('../models/user')

describe('Initially created one user in db', () => {

  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)

    const user = new User({ user: 'root', username: 'root', passwordHash })

    await user.save()
  })

  test('Creation succeeded with new username', async () => {

    const usersAtStart = await helper.usersInDb()

    console.log('usersAtStart', usersAtStart)

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    console.log('usersAtEnd', usersAtEnd)

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const userNames = usersAtEnd.map(tmp => tmp.username)

    expect(userNames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})