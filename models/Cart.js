const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // 👈 important for populate
    required: true
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model('Cart', cartSchema);
