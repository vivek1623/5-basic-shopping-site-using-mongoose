const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')

class User {
  constructor(name, email, cart, id) {
    this.name = name
    this.email = email
    this.cart = cart //{items:[{productId: "", quantity: 0}]}
    this._id = id
  }

  save() {
    const db = getDB()
    return db.collection('users').insertOne(this)
  }

  addToCart(productId) {
    const index = this.cart.items.findIndex(item => item.productId.toString() === productId.toString())
    const updatedCartItems = [...this.cart.items]
    if (index === -1)
      updatedCartItems.push({ productId: new ObjectId(productId), quantity: 1 })
    else
      updatedCartItems[index].quantity = updatedCartItems[index].quantity + 1
    const updatedCart = { items: updatedCartItems }
    const db = getDB()
    return db.collection('users').updateOne({ _id: new Object(this._id) }, { $set: { cart: updatedCart } })
  }

  clearCart() {
    const db = getDB()
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } })
  }

  async getCart() {
    const db = getDB()
    const productIds = this.cart.items.map(item => item.productId)
    const products = await db.collection('products').find({ _id: { $in: productIds } }).toArray()
    return products.map(p => {
      return {
        ...p,
        quantity: this.cart.items.find(i => i.productId.toString() === p._id.toString()).quantity
      }
    })
  }

  deleteItemFromCart(productId) {
    const filteredCartItem = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    const filteredCart = { items: filteredCartItem }
    const db = getDB()
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: filteredCart } })
  }

  static findById(userId) {
    const db = getDB()
    return db.collection('users').findOne({ _id: ObjectId(userId) })
  }
}

module.exports = User
