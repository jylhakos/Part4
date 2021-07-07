const logger = require('../utils/logger')

const listHelper = require('../utils/list_helper')

// $ npm test -- -t 'bigger list calculated equals'

// 4.4
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    }
  ]

  test('likes of empty list equals zero', () => {
    const result = listHelper.totalLikes([])
    //logger.info(result)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    //logger.info(result)
    expect(result).toBe(5)
  })

  test('bigger list calculated equals', () => {
    const result = listHelper.totalLikes(blogs)
    //logger.info(result)
    expect(result).toBe(12)
  })
})