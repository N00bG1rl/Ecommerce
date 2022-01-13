const express = require('express')

const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

const authRouter = require('./Routes/admin/auth')
const adminProductsRouter = require('./Routes/admin/products')
const productsRouter = require('./Routes/products')
const cartsRouter = require('./Routes/carts')

const app = express()
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  cookieSession({
    keys: ['jj8hjghgh798gyyf'],
  })
)

app.use(authRouter)
app.use(adminProductsRouter)
app.use(productsRouter)
app.use(cartsRouter)

app.listen(3000, () => {
  console.log('Listening')
})
