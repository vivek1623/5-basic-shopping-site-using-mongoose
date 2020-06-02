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
    const product = new Product(req.body)
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

// exports.postEditProduct = async (req, res) => {
//   const title = req.body.title
//   const imageUrl = req.body.imageUrl
//   const price = req.body.price
//   const description = req.body.description
//   const id = req.body._id
//   try {
//     const product = new Product(title, imageUrl, price, description, id)
//     await product.save()
//     res.redirect('/admin/products')
//   } catch (e) {
//     res.redirect('/admin/add-product')
//   }
// }


// exports.postDeleteProduct = async (req, res) => {
//   try {
//     if (req.body._id)
//       await Product.deleteById(req.body._id)
//     res.redirect('/admin/products')
//   } catch (e) {
//     console.log('error', e)
//     res.redirect('/admin/products')
//   }
// }