// $ npm test -- tests/4.10.test.js

const mongoose = require('mongoose')

const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const helper = require('../utils/list_helper')

const logger = require('../utils/logger')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f7',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
    }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
})

// 4.10
test('Creates new blog post', async () => {

  const newBlog = {
    _id: "5a422a851b54a676234d17f8",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 1,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  logger.info('initialBlogs.length', initialBlogs.length)

  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)

  // console.log('blogsAtEnd', blogsAtEnd)

  const contents = blogsAtEnd.map(n => n.title)

  expect(contents).toContain('React patterns')
})

afterAll(() => {

  mongoose.connection.close()
})