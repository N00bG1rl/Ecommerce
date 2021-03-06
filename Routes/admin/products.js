const express = require('express')
const multer = require('multer')

const { handleErrors, requireAuth } = require('./middlewares')
const productsRepo = require('../../Repo/productsRepo')
const newProductsTemp = require('../../Views/admin/products/new')
const productsTemp = require('../../Views/admin/products/index')
const productsEditTemp = require('../../Views/admin/products/edit')
const { requireTitle, requirePrice, requireImage } = require('./validators')

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/admin/products', requireAuth, async (req, res) => {
  const products = await productsRepo.getAll()
  res.send(productsTemp({ products }))
})

router.get('/admin/products/new', requireAuth, (req, res) => {
  res.send(newProductsTemp({}))
})

router.post(
  '/admin/products/new',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice, requireImage],
  handleErrors(newProductsTemp),
  async (req, res) => {
    const image = req.file.buffer.toString('base64')
    const { title, price } = req.body
    await productsRepo.create({ title, price, image })

    res.redirect('/admin/products')
  }
)

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
  const product = await productsRepo.getOne(req.params.id)

  if (!product) {
    return res.send('Product not found')
  }

  res.send(productsEditTemp({ product }))
})

router.post(
  '/admin/products/:id/edit',
  requireAuth,
  upload.single('image'),
  [requireTitle, requirePrice],
  handleErrors(productsEditTemp, async req => {
    const product = await productsRepo.getOne(req.params.id)
    return { product }
  }),
  async (req, res) => {
    const changes = req.body

    if (req.file) {
      changes.image = req.file.buffer.toString('base64')
    }

    try {
      await productsRepo.update(req.params.id, changes)
    } catch {
      res.send('Could not find item.')
    }
    res.redirect('/admin/products')
  }
)

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
  await productsRepo.delete(req.params.id)
  res.redirect('/admin/products')
})

module.exports = router
