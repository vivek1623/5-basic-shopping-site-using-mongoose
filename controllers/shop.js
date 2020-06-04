const Product = require('../models/products')
const Order = require('../models/order')

exports.getIndex = async (req, res) => {
  const products = await Product.find()
  res.render('shop/index', {
    pageTitle: 'Shop',
    products: products,
    path: '/',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.getProducts = async (req, res) => {
  const products = await Product.find()
  res.render('shop/product-list', {
    pageTitle: 'All product',
    products: products,
    path: '/products',
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.getProduct = async (req, res) => {
  if (req.params.id) {
    const product = await Product.findById(req.params.id)
    res.render('shop/product-details', {
      pageTitle: 'Product Details',
      product: product,
      path: '/product-details',
      isAuthenticated: req.session.isLoggedIn
    })
  } else
    res.redirect('/products')
}

exports.postCart = async (req, res) => {
  if (!req.body.productId)
    return res.redirect('/products')
  const product = await Product.findById(req.body.productId)
  if (!product)
    return res.redirect('/products')
  await req.user.addToCart(product._id)
  res.redirect('/cart')
}

exports.getCart = async (req, res) => {
  try {
    const user = await req.user.populate('cart.products.productId').execPopulate()
    // console.log('products', user.cart.products)
    res.render('shop/cart', {
      pageTitle: 'Cart',
      products: user.cart.products,
      path: '/cart',
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (e) {
    res.redirect('/')
  }
}

exports.postCartProductDelete = async (req, res) => {
  const productId = req.body.productId
  if (!productId)
    return res.redirect('/products')
  await req.user.removeFromCart(productId)
  res.redirect('/cart')
}

exports.postOrder = async (req, res) => {
  try {
    const user = await req.user.populate('cart.products.productId').execPopulate()
    const products = user.cart.products.map(p => {
      return { quantity: p.quantity, product: { ...p.productId._doc } }
    })
    const order = new Order({ products, userId: req.user._id })
    await order.save()
    await req.user.clearCart()
    res.redirect('/orders')
  } catch (e) {
    console.log('error', e)
    res.redirect('/products')
  }
}

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    })
  } catch (e) {
    console.log('error', e)
    res.redirect('/products')
  }
}