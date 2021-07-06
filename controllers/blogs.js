const logger = require('../utils/logger')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', (request, response) => {

  logger.info(request.body)

  Blog
    .find({})
    .then(blogs => {
      console.log(blogs)
      response.json(blogs)
    })
})

// $ curl -X "GET" http://localhost:3003/api/blogs 

blogsRouter.post('/api/blogs', (request, response) => {

  const blog = new Blog(request.body)

  logger.info(request.body)

  blog
    .save()
    .then(result => {
      logger.info(result)
      response.status(201).json(result)
    })
})

// $ curl -X "POST" http://localhost:3003/api/blogs -H "Content-Type: application/json" -d "{\"title\":\"Hello World\", \"author\":\"Jane Austin\", \"url\":\"http://hello.world.com\", \"likes\":\"0\"}"

blogsRouter.get('/api/blogs', (request, response) => {

  Blog({}).then(blogs => {
    logger.info(blogs)
    response.json(blogs.map(blog => blog.toJSON()))
  })
})

blogsRouter.get('/api/blogs/:id', (request, response, next) => {

  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        logger.info(blog)
        response.json(blog.toJSON())
      } else {
        logger.info('404')
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/api/blogs', (request, response, next) => {

  const logger = require('./utils/logger')

  const body = request.body

  logger.info(body)

  const blog = new Blog({
    title: String,
    author: String,
    url: String,
    likes: Number,
  })

  blog.save()
    .then(savedBlog => {
      response.json(savedBlog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.delete('/api/blogs/:id', (request, response, next) => {

  logger.info(request.params.id)

  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/api/blogs/:id', (request, response, next) => {

  const body = request.body

  logger.info(body)

  const blog = {
    title: String,
    author: String,
    url: String,
    likes: Number
  }

  Blog.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog.toJSON())
    })
    .catch(error => next(error))
})

module.exports = blogsRouter