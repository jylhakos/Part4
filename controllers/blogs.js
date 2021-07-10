const logger = require('../utils/logger')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

var ObjectId = require('mongodb').ObjectID;

const User = require('../models/user')

// $ curl -X "GET" http://localhost:3003/api/blogs 

/*blogsRouter.get('/api/blogs', (request, response) => {

  logger.info(request.body)

  Blog
    .find({})
    .then(blogs => {
      console.log(blogs)
      response.json(blogs)
    })
})*/

// $ curl -X "GET" http://localhost:3003/api/blogs

// 4.17
blogsRouter.get('/api/blogs', async (request, response) => {

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, _id: 1 }, User) 
  
  console.log(blogs)

  response.json(blogs.map(blog => blog.toJSON()))

  /*Blog({}).then(blogs => {
    logger.info(blogs)
    response.json(blogs.map(blog => blog.toJSON()))
  })*/
})

// $ curl -X "GET" http://localhost:3003/api/blogs/60e907b55efce114a45f6b08

blogsRouter.get('/api/blogs/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog.toJSON())
  } else {
    logger.info('404')
    response.status(404).end()
  }
    /*.then(blog => {
      if (blog) {
        logger.info(blog)
        response.json(blog.toJSON())
      } else {
        logger.info('404')
        response.status(404).end()
      }
    })
    .catch(error => next(error))*/
})

// $ curl -X "POST" http://localhost:3003/api/blogs -H "Content-Type: application/json" -d "{\"title\":\"React patterns\", \"author\":\"Michael Chan\", \"url\":\"https://reactpatterns.com/\", \"likes\":\"5\"}"

// 4.17
blogsRouter.post('/api/blogs', async (request, response) => {

  const body = request.body

  logger.info(body)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: '60e9604707186054563bd9fc',
  })

  try {
    const savedBlog = await blog.save()
      logger.info(savedBlog)
      response.json(savedBlog.toJSON())
    } catch (error) {
      logger.error(error)
  }

})

/*blogsRouter.post('/api/blogs', (request, response) => {

  const blog = new Blog(request.body)

  logger.info(request.body)

  blog
    .save()
    .then(result => {
      logger.info(result)
      response.status(201).json(result)
    })
})*/

// $ curl -X "DELETE" "http://localhost:3003/api/blogs/60e907f15efce114a45f6b0a"

// 4.13
blogsRouter.delete('/api/blogs/:id', async (request, response) => {

  logger.info('request.params.id', request.params.id)

  // 4.1
  /*Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      logger.info(response)
      response.status(204).end()
    })
    .catch(error => next(error))*/

  // 4.13
  try {
    const deletedBlog = await Blog.findByIdAndRemove(request.params.id)
    logger.info(deletedBlog)
    response.json(deletedBlog.toJSON())
  } catch (error) {
    logger.error(error)
  }
})

// $ curl -X "PUT" "http://localhost:3003/api/blogs/60e907b55efce114a45f6b08" -H "Content-Type: application/json" -d "{\"title\":\"React patterns\", \"author\":\"Michael Chan\", \"url\":\"https://reactpatterns.com/", \"likes\":\"5\"}" -v

// 4.14 
blogsRouter.put('/api/blogs/:id', async (request, response) => {

  const body = request.body

  logger.info(body)

  console.log(body)

  /*const blog = {
    _id: request.params.id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }*/

  try {
    const updatedBlog = await Blog.findByIdAndUpdate({_id: ObjectId(request.params.id)}, {$inc: {'likes': body.likes}}, { new: true })
    logger.info(updatedBlog)
    response.json(updatedBlog.toJSON())
  } catch (error) {
    logger.error(error)
  }
})

module.exports = blogsRouter