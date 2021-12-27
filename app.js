const express = require('express')
// Middleware
const bodyParser = require('body-parser')

const usersRepo = require('./repo/users')

// Creates an Express application.
const app = express()

// Refactor
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
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
app.post('/', async (req, res) => {
  // Deconstructor from req.body
  const { email, password, passwordConfirmation } = req.body

  const userExists = await usersRepo.getOneBy({ email: email })
  if (userExists) {
    return res.send('Email is allready in use.')
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match.')
  }

  res.send('Acount created.')
})

app.listen(3000, () => {
  console.log('Listening')
})
