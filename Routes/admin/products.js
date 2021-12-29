const express = require('express')
const multer = require('multer')

// Import custom middlewares
const { handleErrors, requireAuth } = require('./middlewares')
const productsRepo = require('../../Repo/productsRepo')
const newProductsTemp = require('../../Views/admin/products/new')
const productsTemp = require('../../Views/admin/products/index')
const productsEditTemp = require('../../Views/admin/products/edit')
const { requireTitle, requirePrice, requireImage } = require('./validators')

// SubRouter for app = express()
const router = express.Router()
// For image upload, middleware
const upload = multer({ storage: multer.memoryStorage() })

// Find and render all products
router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTemp({ products }))
})

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(newProductsTemp({}))
})

// Require stuff from validators and last arg is callback
router.post(
  '/admin/products/new',
  // Auth handling is extracted to custom middleware.js
  requireAuth,
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

    res.redirect('/admin/products')
  }
)

// :id is wildcard - request automatically fills in with any chars
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id)

  if (!product) {
    return res.send('Product not found')
  }

  res.send(productsEditTemp({ product }))
})

router.post(
  '/admin/products/:id/edit',
  // Require login
  requireAuth,
  // Edit image
  upload.single('image'),
  [requireTitle, requirePrice],
  // As sec arg we entered func as cheat for errors middleware ...?
  handleErrors(productsEditTemp, async req => {
    // It takes current project and returns it
    const product = await productsRepo.getOne(req.params.id)
    return { product }
  }),
  async (req, res) => {
    const changes = req.body

    if (req.file) {
      changes.image = req.file.buffer.toString('base64')
    }

    try {
      // Sec para is for changes we want to apply
      await productsRepo.update(req.params.id, changes)
    } catch {
      res.send('Could not find item.')
    }

    res.redirect('/admin/products')
  }
)

module.exports = router
