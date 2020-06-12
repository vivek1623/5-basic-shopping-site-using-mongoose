const express = require('express')

const adminControllers = require('../controllers/admin')
const authMiddleware = require('../middlewares/auth')
const validatorMiddleware = require('../middlewares/validator')

const router = express.Router()

// /admin/products => GET
router.get('/products', authMiddleware, adminControllers.getProducts)

// /admin/add-product => GET
router.get('/add-product', authMiddleware, adminControllers.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', authMiddleware, validatorMiddleware.product, adminControllers.postAddProduct)

// /admin/edit-product => GET
router.get('/edit-product/:id', authMiddleware, adminControllers.getEditProduct)

// /admin/edit-product => POST
router.post('/edit-product', authMiddleware, validatorMiddleware.product, adminControllers.postEditProduct)

// /admin/delete-product => POST
router.post('/delete-product', authMiddleware, adminControllers.postDeleteProduct)

module.exports = router
