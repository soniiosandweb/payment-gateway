const mongoose = require('mongoose');
const Payments = require("../models/payments");
const Stripe = require("stripe");

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

exports.googlePayProcess = async (req, res) => {
  try {
    const { token, amount } = req.body;

    if (!token || !amount) {
      return res.status(400).json({ success: false, error: "Missing token or amount" });
    }

    const parsedToken = JSON.parse(token);

    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100),
      currency: "inr",
      source: parsedToken.id,
      description: "Google Pay Payment",
    });

    const payment = new Payments({
      transactionId: charge.id,
      amount,
      currency: charge.currency,
      paymentStatus: charge.status,
      paymentMethod: charge.payment_method_details?.type || "gpay",
    });

    await payment.save();

    res.json({ success: true, charge });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}

