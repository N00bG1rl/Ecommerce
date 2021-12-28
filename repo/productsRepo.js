const Repo = require('./repo')

class ProductsRepo extends Repo {}

module.exports = new ProductsRepo('products.json')
