const express = require('express')
// Destructure out one validator we care about
const { check } = require('express-validator')

const usersRepo = require('../../Repo/users')
const signupTemp = require('../../Views/admin/auth/signup')
const signinTemp = require('../../Views/admin/auth/signin')

// SubRouter for app = express()
const router = express.Router()

router.get('/signup', (req, res) => {
  res.send(signupTemp({ req: req }))
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
router.post('/signup', async (req, res) => {
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

router.get('/signout', (req, res) => {
  req.session = null

  res.send('Logged out.')
})

router.get('/signin', (req, res) => {
  res.send(signinTemp())
})

router.post('/signin', async (req, res) => {
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

module.exports = router
