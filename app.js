const express = require('express')
// Middleware
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const usersRepo = require('./Repo/users')

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

app.get('/signup', (req, res) => {
  res.send(`
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <input name="passwordConfirmation" placeholder="password confirmation" />
        <button>Sign Up</button>
      </form>
    </div>
  `)
})

// // # Own created body parser
// // Helper function - middleware
// const bodyParser = (req, res, next) => {
//   if (req.method === 'POST') {
//     // on = eventListener
//     // data is buffer - hex value, <Buffer 65 6d 61...
//     req.on('data', data => {
//       // Turn buffer into string with utf8 encode
//       const parsed = data.toString('utf8').split('&')
//       // Object, that holds key:value pairs
//       const formData = {}

//       for (let pair of parsed) {
//         // Destructuring, returns key:value pairs
//         const [key, value] = pair.split('=')
//         // Assign to formData
//         formData[key] = value
//       }
//       req.body = formData
//       next()
//     })
//   } else {
//     next()
//   }
// }

// app.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {}
// User trying to create acount
app.post('/signup', async (req, res) => {
  // Deconstructor from req.body
  const { email, password, passwordConfirmation } = req.body

  const userExists = await usersRepo.getOneBy({ email: email })
  if (userExists) {
    return res.send('Email is allready in use.')
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match.')
  }

  // Create new user
  const user = await usersRepo.create({ email, password })

  // Added by cookie session
  req.session.userId = user.id

  res.send('Acount created.')
})

app.get('/signout', (req, res) => {
  req.session = null

  res.send('Logged out.')
})

app.get('/signin', (req, res) => {
  res.send(
    `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `
  )
})

app.post('/signin', async (req, res) => {
  // Destructor from app.get
  const { email, password } = req.body

  // Find if database has this email: email
  const user = await usersRepo.getOneBy({ email })

  // If email is not found
  if (!user) {
    return res.send('Email not found.')
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  )

  // If password wont match with user
  if (!validPassword) {
    return res.send('Invalid password.')
  }

  // Authenticate user
  req.session.userId = user.id

  res.send('You are signed in.')
})

app.listen(3000, () => {
  console.log('Listening')
})
