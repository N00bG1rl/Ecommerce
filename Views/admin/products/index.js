const layout = require('../layout')

// Template function
module.exports = ({ products }) => {
  // Iterate over every product and add content to it
  // Result is array of html snippets
  // Join them back together into string
  const renderedProducts = products
    .map(product => {
      return ` <div>${product.title}</div>`
    })
    .join('')

  return layout({
    content: `
      <h1 class="title">Products</h1>
      ${renderedProducts}
    `,
  })
}
