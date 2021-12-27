const express = require('express')
// Middleware
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const authRouter = require('./Routes/admin/auth')

// Creates an Express application.
const app = express()

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

app.listen(3000, () => {
  console.log('Listening')
})
