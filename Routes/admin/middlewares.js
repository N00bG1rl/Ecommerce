const { validationResult } = require('express-validator')

module.exports = {
  handleErrors(templates, dataCallback) {
    return async (req, res, next) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        let data = {}
        if (dataCallback) {
          data = await dataCallback(req)
        }

        return res.send(templates({ errors, ...data }))
      }
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
