const logger = require('./logger')

// 4.3
const dummy = (blogs) =>  {
  logger.info('dummy')
  return 1
}

module.exports = {
  dummy
}