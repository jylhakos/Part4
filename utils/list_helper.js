const logger = require('./logger')

const Blog = require('../models/blog')

const User = require('../models/user')

// 4.3
const dummy = (blogs) =>  {
  logger.info('dummy')
  return 1
};

// 4.4
const totalLikes = (list_of_blogs) => {

  const likes_array = list_of_blogs.map(values => values.likes)

  const reducer = (likes, like) => {

    return likes + like
  }

  return likes_array === 0 ? 0 : likes_array.reduce(reducer, 0)
}

// 4.10 
const blogsInDb = async () => {

  logger.info('blogsInDb')

  const blogs = await Blog.find({})

  logger.info('blogs',blogs)

  return blogs.map(blog => blog.toJSON())
}

// 4.15
const usersInDb = async () => {

  const users = await User.find({})

  console.log(users)

  return users.map(user => user.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  blogsInDb,
  usersInDb
};