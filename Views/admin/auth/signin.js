const layout = require('../layout')
const { getErrors } = require('../../helpers')

module.exports = ({ req, errors }) => {
  return layout({
    // Pass content on to layout.js
    content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        ${getErrors(errors, 'email')}
        <input name="password" placeholder="password" />
        ${getErrors(errors, 'password')}
        <button>Sign In</button>
      </form>
    </div>
  `,
  })
}
