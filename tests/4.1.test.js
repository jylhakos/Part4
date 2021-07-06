const logger = require('../utils/logger')

const listHelper = require('../utils/list_helper')

// 4.3
test('dummy returns one', () => {
  
  const blogs = []

  const result = listHelper.dummy(blogs)

  logger.info(result)

  expect(result).toBe(1)
})