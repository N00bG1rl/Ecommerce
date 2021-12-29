const express = require('express')

const productsRepo = require('../Repo/productsRepo')
const productsIndexTemp = require('../Views/products/index')

// SubRouter for app = express()
const router = express.Router()

router.get('/', async (req, res) => {
  // Get all products
  const products = await productsRepo.getAll()

  // Pass all products to products index page
  res.send(productsIndexTemp({ products }))
})

module.exports = router
