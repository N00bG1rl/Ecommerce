const express = require('express')

const productsRepo = require('../Repo/productsRepo')
const productsIndexTemp = require('../Views/products/index')

const router = express.Router()

router.get('/', async (req, res) => {
  const products = await productsRepo.getAll()

  res.send(productsIndexTemp({ products }))
})

module.exports = router
