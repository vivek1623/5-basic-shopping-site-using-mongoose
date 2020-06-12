const { validationResult } = require('express-validator/check')

const Product = require('../models/products')

exports.getAddProduct = (req, res) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorMessage
  })
}

exports.postAddProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: errors.array()[0].msg
      })
    const product = new Product({ ...req.body, userId: req.user._id })
    await product.save()
    res.redirect('/admin/products')
  } catch (e) {
    req.flash('error', 'Something went wrong')
    res.redirect('/admin/add-product')
  }
}

exports.getProducts = async (req, res) => {
  const message = req.flash('error');
  const errorMessage = message.length > 0 ? message[0] : null
  const products = await Product.find()
  res.render('admin/products', {
    pageTitle: 'All admin products',
    products: products,
    path: '/admin/products',
    errorMessage
  })
}

exports.getEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      req.flash('error', 'Product not found')
      return res.redirect('/admin/products')
    }
    const message = req.flash('error');
    const errorMessage = message.length > 0 ? message[0] : null
    res.render('admin/add-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: product,
      errorMessage
    })
  } catch (e) {
    req.flash('error', 'Something went wrong')
    res.redirect('/admin/products')
  }
}

exports.postEditProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.render('admin/add-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: false,
        errorMessage: errors.array()[0].msg
      })
    const product = await Product.findById(req.body._id)
    product.title = req.body.title
    product.imageUrl = req.body.imageUrl
    product.price = req.body.price
    product.description = req.body.description
    await product.save()
    res.redirect('/admin/products')
  } catch (e) {
    req.flash('error', 'Something went wrong')
    res.redirect('/admin/add-product')
  }
}


exports.postDeleteProduct = async (req, res) => {
  try {
    if (req.body._id)
      await Product.findByIdAndRemove(req.body._id)
    res.redirect('/admin/products')
  } catch (e) {
    console.log('error', e)
    req.flash('error', 'Something went wrong')
    res.redirect('/admin/products')
  }
}