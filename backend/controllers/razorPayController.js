const mongoose = require('mongoose');
const Payments = require("../models/payments");
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.razorPayCreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await instance.orders.create({ amount: Math.round(parseFloat(amount) * 100), currency: 'INR', receipt: 'rcpt_' + Date.now() });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.razorPayProcess = async (req, res) => {
  try {

    const { paymentId, amount } = req.body;
    if (!paymentId || !amount) {
      return res.status(400).json({ success: false, error: "Missing token or amount" });
    }

    const payment = new Payments({
      transactionId: paymentId,
      amount,
      currency: "inr",
      paymentStatus: "succeeded",
      paymentMethod: "Razorpay",
    });

    await payment.save();

    res.json({ success: true, payment });

  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}