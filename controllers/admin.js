const Product = require('../models/products')

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = async (req, res) => {
  try {
    const product = new Product({ ...req.body, userId: req.user._id })
    await product.save()
    res.redirect('/admin/products')
  } catch (e) {
    res.redirect('/admin/add-product')
  }
}

exports.getProducts = async (req, res) => {
  const products = await Product.find()
  res.render('admin/products', {
    pageTitle: 'All admin products',
    products: products,
    path: '/admin/products'
  })
}

exports.getEditProduct = async (req, res) => {
  const id = req.params.id
  const product = await Product.findById(id)
  if (!product)
    return res.redirect('/')
  res.render('admin/add-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: true,
    product: product
  })
}

exports.postEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.body._id)
    product.title = req.body.title
    product.imageUrl = req.body.imageUrl
    product.price = req.body.price
    product.description = req.body.description
    await product.save()
    res.redirect('/admin/products')
  } catch (e) {
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
    res.redirect('/admin/products')
  }
}