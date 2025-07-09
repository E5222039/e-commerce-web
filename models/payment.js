const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentId: String,
  amount: Number,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
