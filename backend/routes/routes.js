const express = require("express");
const { googlePayProcess } = require("../controllers/googlePayController");
const { razorPayProcess, razorPayCreateOrder } = require("../controllers/razorPayController");
const { initiatePayment, checkPaymentStatus } = require("../controllers/phonePayController");
const router = express.Router();

// Process Google Pay Payment
router.post('/process-payment', googlePayProcess);

// Razor Pay create order
router.post('/razor-create-order', razorPayCreateOrder);

// Process Razor Pay Payment
router.post('/razorpay-process', razorPayProcess);

// Initiate Phone Pay Paymeny
router.post('/phonepay-initiate', initiatePayment);

// Check Phone Pay Payment Status
router.get('/phonepay-status/:merchantTransactionId', checkPaymentStatus);

module.exports = router;