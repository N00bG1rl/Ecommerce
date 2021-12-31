const Repo = require('./repo')

class CartsRepo extends Repo {}

module.exports = new CartsRepo('cart.json')
