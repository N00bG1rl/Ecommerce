const { check } = require('express-validator')

const usersRepo = require('../../Repo/users')

module.exports = {
  requireTitle: check('title')
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage('Must be between 5 and 20 characters'),
  requirePrice: check('price')
    .trim()
    .toFloat()
    .isFloat({ min: 1 })
    .withMessage('Must be creater than 1'),
  requireImage: check('image').custom((image, { req }) => {
    const file = req.file
    if (!file) {
      throw new Error('Please upload image')
    }
    return (req, res, next) => {
      next()
    }
  }),
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email.')
    .custom(async email => {
      const userExists = await usersRepo.getOneBy({ email })
      if (userExists) {
        throw new Error('Email is allready in use.')
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Must be between 4 and 20 characters.'),
  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 4, max: 20 })
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Passwords must match.')
      }
      return true
    }),
  requireValidEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email.')
    .custom(async email => {
      const user = await usersRepo.getOneBy({ email })
      if (!user) {
        throw new Error('Email not found.')
      }
    }),
  requireValidPassword: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email })

      if (!user) {
        throw new Error('Email not found.')
      }

      const validPassword = await usersRepo.comparePasswords(
        user.password,
        password
      )
      if (!validPassword) {
        throw new Error('Invalid password.')
      }
    }),
}
