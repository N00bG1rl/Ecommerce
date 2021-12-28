const layout = require('../layout')

// Template function
module.exports = ({ product }) => {
  return layout({
    content: `
      <form method="POST">
        <input name="title" value="${product.title}" />
        <input name="price" value="${product.price}" />
        <input name="image" type="file" /> 
        <button>Submit</button>
      </form>
    `,
  })
}
