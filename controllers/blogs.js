const logger = require('../utils/logger')

const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

var ObjectId = require('mongodb').ObjectID;

const User = require('../models/user')

// 4.19
const jwt = require('jsonwebtoken')

// 4.19
const getTokenFrom = request => {

  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {

    return authorization.substring(7)
  }

  return null
}

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

// $ curl -X "POST" http://localhost:3003/api/blogs -H "Content-Type: application/json" -H "Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2MGU5NjA0NzA3MTg2MDU0NTYzYmQ5ZmMiLCJpYXQiOjE2MjU5NjU4NDl9.UdJx2pAefZfdR_5JMjvtcNk-KtbgCJtjGmbloiPqq6c" -d "{\"title\":\"Canonical string reduction\", \"author\":\"Edsger W. Dijkstra\", \"url\":\"http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html\", \"likes\":\"5\"}"

// 4.17, 4.19
blogsRouter.post('/api/blogs', async (request, response) => {

  logger.info(request)

  const body = request.body

  logger.info(body)

  //console.log(body)

  // 4.19
  const token = getTokenFrom(request)

  logger.info(token)

  const decodedToken = jwt.verify(token, process.env.SECRET)

  logger.info(decodedToken)

  if (!token || !decodedToken.id) {

    return response.status(401).json({ error: 'The token is missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  logger.info(user)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })

  logger.info(blog)

  try {

    const savedBlog = await blog.save()

    logger.info(savedBlog)

    user.blogs = user.blogs.concat(savedBlog._id)

    logger.info('user.blogs', user.blogs)

    const savedUser = await user.save()

    logger.info(savedUser)

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