const express = require('express')
const cartsRepo = require('../Repo/cart')
const productsRepo = require('../Repo/productsRepo')
const cartShowTemp = require('../Views/carts/show')

const router = express.Router()

// We need 3 different routes here:

// 1. Recive a post request to add an item to a cart
// Together with <form action="/cart/products"../> in products index.js
router.post('/cart/products', async (req, res) => {
  // Figure out the cart. If there is no cart...
  // We need to create one, and store the cart id on the
  // req.session.cartId property
  let cart
  if (!req.session.cartId) {
    // With create we need starting object - assaign empty array to repo
    cart = await cartsRepo.create({ items: [] })
    // After creating object, it creates id, and we can use it next
    req.session.cartId = cart.id
  } else {
    // Cart allready exists and we need to get it from
    cart = await cartsRepo.getOne(req.session.cartId)
  }

  // ProductId is from products/index.js - name="productId"
  const existingItem = cart.items.find(item => {
    return item.id === req.body.productId
  })
  if (existingItem) {
    // Either increment quantity for existing product
    existingItem.quantity++
  } else {
    // OR add new product to items array.
    cart.items.push({ id: req.body.productId, quantity: 1 })
  }

  await cartsRepo.update(cart.id, { items: cart.items })

  res.redirect('/cart')
})

// 2. Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  // If there is no cart in cookies, return and redirect
  if (!req.session.cartId) {
    return res.redirect('/')
  }

  // Get cart from cartsRepo - repo
  const cart = await cartsRepo.getOne(req.session.cartId)

  // After feching iterate over items
  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id)

    item.product = product
  }

  // Pass items into show.js
  res.send(cartShowTemp({ items: cart.items }))
})

// 3. Receive a post request to delete an item from a cart
// Get them from show.js
router.post('/cart/products/delete', async (req, res) => {
  // Get the current item id and assign it to varjable
  const { itemId } = req.body

  // Get the current cart id and assign it to varjable
  const cart = await cartsRepo.getOne(req.session.cartId)

  // Find the current item id from current cart id to delete that item
  // Returns new array 'items' with correct item filtered out
  const items = cart.items.filter(item => item.id !== itemId)

  // Then update our cart
  // First arg is cart id, sec arg is thing to update through repo.js
  await cartsRepo.update(req.session.cartId, { items })

  // Also need response
  res.redirect('/cart')
})

module.exports = router
