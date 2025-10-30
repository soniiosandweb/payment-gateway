const mongoose = require('mongoose');

const googlePaySchema = new mongoose.Schema({
  transactionId: String,
  amount: Number,
  currency: String,
  paymentStatus: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('payments', googlePaySchema);