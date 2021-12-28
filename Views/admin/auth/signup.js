const layout = require('../layout')
const { getErrors } = require('../../helpers')

// Destructure out an object
module.exports = ({ req, errors }) => {
  return layout({
    content: `
  <div>
    Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email" />
      ${getErrors(errors, 'email')}
      <input name="password" placeholder="password" />
      ${getErrors(errors, 'password')}
      <input name="passwordConfirmation" placeholder="password confirmation" />
      ${getErrors(errors, 'passwordConfirmation')}
      <button>Sign Up</button>
    </form>
  </div>
  `,
  })
}
