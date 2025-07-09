const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number
  }],
  amount: Number,
  paidAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
