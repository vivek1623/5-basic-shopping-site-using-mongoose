const express = require('express')

const shopControllers = require('../controllers/shop')

const router = express.Router()

router.get('/', shopControllers.getIndex)

router.get('/products', shopControllers.getProducts)

router.get('/products/:id', shopControllers.getProduct)

router.post('/cart', shopControllers.postCart)

router.get('/cart', shopControllers.getCart)

router.post('/cart-delete-item', shopControllers.postCartProductDelete)

router.post('/create-order', shopControllers.postOrder)

router.get('/orders', shopControllers.getOrders)


module.exports = router