const express = require('express')

const adminControllers = require('../controllers/admin')

const router = express.Router()

// /admin/products => GET
router.get('/products', adminControllers.getProducts)

// /admin/add-product => GET
router.get('/add-product', adminControllers.getAddProduct)

// /admin/add-product => POST
router.post('/add-product', adminControllers.postAddProduct)

// /admin/edit-product => GET
router.get('/edit-product/:id', adminControllers.getEditProduct)

// /admin/edit-product => POST
router.post('/edit-product', adminControllers.postEditProduct)

// /admin/delete-product => POST
router.post('/delete-product', adminControllers.postDeleteProduct)

module.exports = router
