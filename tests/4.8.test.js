// $ npm test -- tests/4.8.test.js

const mongoose = require('mongoose')

const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const listHelper = require('../utils/list_helper')

const logger = require('../utils/logger')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f4',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
    },
  {
      _id: "5a422a851b54a676234d17f5",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f6",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

// 4.8 
test('all blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are three blogs in list', async () => {

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(3)
})



test('the three blogs have seventeen likes', async () => {

  const response = await api.get('/api/blogs')

  const blogs = response.body

  const result = listHelper.totalLikes(blogs)

  logger.info('result', result)

  expect(result).toBe(17)
})

afterAll(() => {

  mongoose.connection.close()
})