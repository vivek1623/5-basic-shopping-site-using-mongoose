const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  cart: {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ]
  }
})

userSchema.methods.addToCart = function (productId) {
  const user = this
  const index = user.cart.products.findIndex(product => product.productId.toString() === productId.toString())
  if (index !== -1)
    user.cart.products[index].quantity = user.cart.products[index].quantity + 1
  else
    user.cart.products.push({ productId, quantity: 1 })
  user.save()
}

const User = model('User', userSchema)

module.exports = User
