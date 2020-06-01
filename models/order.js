const { ObjectId } = require('mongodb')
const { getDB } = require('../utils/database')

class Order {
  constructor(items, userId, userName) {
    this.items = items
    this.userId = new ObjectId(userId)
  }

  save() {
    const db = getDB()
    return db.collection('orders').insertOne(this)
  }

  static findOrderByUserId(userId) {
    const db = getDB()
    return db.collection('orders').find({ 'userId': new ObjectId(userId) }).toArray()
  }
}

module.exports = Order