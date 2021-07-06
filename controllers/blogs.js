
const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', (request, response) => {
  console.log(request.body)
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

  console.log(request.body)

  blog
    .save()
    .then(result => {
      console.log(result)
      response.status(201).json(result)
    })
})

// $ curl -X "POST" http://localhost:3003/api/blogs -H "Content-Type: application/json" -d "{\"title\":\"Hello World\", \"author\":\"Jane Austin\", \"url\":\"http://hello.world.com\", \"likes\":\"0\"}"


/*blogsRouter.get('/', (request, response) => {

  Blog({}).then(blogs => {
    response.json(blogs.map(blog => blog.toJSON()))
  })
})

blogsRouter.get('/:id', (request, response, next) => {

  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {

  const body = request.body

  const blog = new Blog({
    title: String,
    author: String,
    url: String,
    likes: Number,
  })

  blog.save()
    .then(savedBlog {
      response.json(savedBlog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {

  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {

  const body = request.body

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
})*/

module.exports = blogsRouter