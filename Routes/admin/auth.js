const express = require('express')
// Destructure out one validator we care about
const { check, validationResult } = require('express-validator')

const usersRepo = require('../../Repo/users')
const signupTemp = require('../../Views/admin/auth/signup')
const signinTemp = require('../../Views/admin/auth/signin')
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireValidEmail,
  requireValidPassword,
} = require('./validators')

// SubRouter for app = express()
const router = express.Router()

router.get('/signup', (req, res) => {
  res.send(signupTemp({ req }))
})

// User trying to create acount
router.post(
  '/signup',
  // express-validator, imported from validators.js
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    // express-validator
    const errors = validationResult(req)
    console.log(errors)

    // isEmpty() is from validators
    if (!errors.isEmpty()) {
      return res.send(signupTemp({ req, errors }))
    }

    // Deconstructor from req.body
    const { email, password } = req.body
    // Create new user
    const user = await usersRepo.create({
      email,
      password,
    })

    // Added by cookie session
    req.session.userId = user.id

    res.send('Acount created.')
  }
)

router.get('/signout', (req, res) => {
  req.session = null

  res.send('Logged out.')
})

router.get('/signin', (req, res) => {
  // Empty arg object is nessesary due errors arg
  // that is passed in on post method
  res.send(signinTemp({}))
})

router.post(
  '/signin',
  [requireValidEmail, requireValidPassword],
  async (req, res) => {
    // express-validator
    const errors = validationResult(req)
    console.log(errors)

    // isEmpty() is from validators
    if (!errors.isEmpty()) {
      return res.send(signinTemp({ errors }))
    }

    // Destructor from app.get
    const { email } = req.body
    const user = await usersRepo.getOneBy({ email })

    // Authenticate user
    req.session.userId = user.id

    res.send('You are signed in.')
  }
)

module.exports = router

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
