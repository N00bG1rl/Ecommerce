const express = require('express')

const { handleErrors } = require('./middlewares')
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

const router = express.Router()

router.get('/signup', (req, res) => {
  res.send(signupTemp({ req }))
})

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemp),
  async (req, res) => {
    const { email, password } = req.body
    const user = await usersRepo.create({
      email,
      password,
    })

    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

router.get('/signout', (req, res) => {
  req.session = null

  res.send('Logged out.')
})

router.get('/signin', (req, res) => {
  res.send(signinTemp({}))
})

router.post(
  '/signin',
  [requireValidEmail, requireValidPassword],
  handleErrors(signinTemp),
  async (req, res) => {
    const { email } = req.body
    const user = await usersRepo.getOneBy({ email })

    req.session.userId = user.id

    res.redirect('/admin/products')
  }
)

module.exports = router
