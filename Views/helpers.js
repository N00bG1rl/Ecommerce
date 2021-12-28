module.exports = {
  // Helper function
  getErrors(errors, prop) {
    // prop === 'email' || 'password' || 'passwordConfirmation'
    try {
      // mapped is from express-validator library
      // errors.mapped() === { email: {}, password: {} ...}
      // Return msg to show error message to user
      return errors.mapped()[prop].msg
    } catch (err) {
      // Not for errors, a work around = cheat
      return ''
    }
  },
}
