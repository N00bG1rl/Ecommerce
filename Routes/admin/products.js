const express = require('express')
const multer = require('multer')

const { handleErrors } = require('./middlewares')
const productsRepo = require('../../Repo/productsRepo')
const newProductsTemp = require('../../Views/admin/products/new')
const productsTemp = require('../../Views/admin/products/index')
const { requireTitle, requirePrice, requireImage } = require('./validators')

// SubRouter for app = express()
const router = express.Router()
// For image upload, middleware
const upload = multer({ storage: multer.memoryStorage() })

// Find and render all products
router.get('/admin/products', async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTemp({ products }))
})

router.get('/admin/products/new', (req, res) => {
  res.send(newProductsTemp({}))
})

// Require stuff from validators and last arg is callback
router.post(
  '/admin/products/new',
  // multer - middleware
  // Middleware need to be correct order to work together
  upload.single('image'),
  // express-validators - middleware
  [requireTitle, requirePrice, requireImage],
  // Error handling is extracted to custom middleware.js
  handleErrors(newProductsTemp),
  async (req, res) => {
    // Make image into string that is encoded into base64
    const image = req.file.buffer.toString('base64')
    // Get req.body.title & req.body.price
    const { title, price } = req.body
    await productsRepo.create({ title, price, image })

    res.send('Submitted')
  }
)

module.exports = router
