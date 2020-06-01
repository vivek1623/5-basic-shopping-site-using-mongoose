const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')
class Product {
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new ObjectId(id) : null
    this.userId = userId
  }

  save() {
    const db = getDB()
    if (this._id)
      return db.collection('products').updateOne({ _id: this._id }, { $set: this })
    return db.collection('products').insertOne(this)
  }

  static findById(productId) {
    const db = getDB()
    return db.collection('products').find({ _id: new ObjectId(productId) }).next()
  }

  static deleteById(productId) {
    const db = getDB()
    return db.collection('products').deleteOne({ _id: new ObjectId(productId) })
  }

  static fetchAll() {
    const db = getDB()
    return db.collection('products').find().toArray()
  }
}

module.exports = Product
