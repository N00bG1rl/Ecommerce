// Destructure out one validator we care about
const { validationResult } = require('express-validator')

// Custom error handling middleware
module.exports = {
  // sec callback is for products cheat at products.js
  handleErrors(templates, dataCallback) {
    // Return a function because every middleware has to be a func
    return async (req, res, next) => {
      // express-validator
      const errors = validationResult(req)

      // isEmpty() is from validators
      if (!errors.isEmpty()) {
        // Some weird product cheat?
        let data = {}
        if (dataCallback) {
          data = await dataCallback(req)
        }

        return res.send(templates({ errors, ...data }))
      }

      // next() allows to continue function execution (if there was no errors)
      next()
    }
  },
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin')
    }

    next()
  },
}
