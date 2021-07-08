const logger = require('./logger')

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

module.exports = {
  dummy,
  totalLikes,
};