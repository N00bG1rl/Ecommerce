// Destructure out one validator we care about
const { validationResult } = require('express-validator')

// Custom error handling middleware
module.exports = {
  handleErrors(templates) {
    // Return a function because every middleware has to be a func
    return (req, res, next) => {
      // express-validator
      const errors = validationResult(req)

      // isEmpty() is from validators
      if (!errors.isEmpty()) {
        return res.send(templates({ req, errors }))
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
