const express = require('express')
// Middleware
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./Routes/admin/auth')
const adminProductsRouter = require('./Routes/admin/products')
const productsRouter = require('./Routes/products')

// Creates an Express application.
const app = express()

// Make public folder to be public, for style...
app.use(express.static('public'))
// Refactor
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cookieSession({
    // For pretending to someone else in browser - so cookie does not get
    // stolen with correct key
    keys: ['jj8hjghgh798gyyf'],
  })
)
app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)

app.listen(3000, () => {
  console.log('Listening')
})
