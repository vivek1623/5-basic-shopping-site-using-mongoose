const express = require('express')

const shopControllers = require('../controllers/shop')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

router.get('/', shopControllers.getIndex)

router.get('/products', shopControllers.getProducts)

router.get('/products/:id', shopControllers.getProduct)

router.post('/cart', authMiddleware, shopControllers.postCart)

router.get('/cart', authMiddleware, shopControllers.getCart)

router.post('/cart-delete-item', authMiddleware, shopControllers.postCartProductDelete)

router.post('/create-order', authMiddleware, shopControllers.postOrder)

router.get('/orders', authMiddleware, shopControllers.getOrders)


module.exports = router