const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give a password as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ostce.mongodb.net/cs-e4670-blogs?retryWrites=true&w=majority`

// const mongoUrl = 'mongodb://localhost/cs-e4670-blogs'

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: String,
  author: String,
  url: String,
  likes: Number
})

/*
blog.save().then(response => {
  console.log('blog saved')
  mongoose.connection.close()
})
*/

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close()
})