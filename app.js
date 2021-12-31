const express = require('express')
// Middleware
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

// Routes
const authRouter = require('./Routes/admin/auth')
const adminProductsRouter = require('./Routes/admin/products')
const productsRouter = require('./Routes/products')
const cartsRouter = require('./Routes/carts')

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
// Assosiate routes
app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartsRouter)

app.listen(3000, () => {
  console.log('Listening')
})
