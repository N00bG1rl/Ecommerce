const express = require('express')
// Destructure out one validator we care about
const { validationResult } = require('express-validator')
const ProductsRepo = require('../../Repo/productsRepo')
const { requireTitle, requirePrice } = require('./validators')

const newProductsTemp = require('../../Views/admin/products/new')

// SubRouter for app = express()
const router = express.Router()

router.get('/admin/products', (req, res) => {})

router.get('/admin/products/new', (req, res) => {
  res.send(newProductsTemp({}))
})

// Require stuff from validators and last arg is callback
router.post('/admin/products/new', [requireTitle, requirePrice], (req, res) => {
  const errors = validationResult(req)
  console.log(errors)

  res.send('Submitted')
})

module.exports = router
