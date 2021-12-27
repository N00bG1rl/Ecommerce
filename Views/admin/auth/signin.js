const layout = require('../layout')

module.exports = () => {
  return layout({
    // Pass content on to layout.js
    content: `
    <div>
      <form method="POST">
        <input name="email" placeholder="email" />
        <input name="password" placeholder="password" />
        <button>Sign In</button>
      </form>
    </div>
  `,
  })
}
