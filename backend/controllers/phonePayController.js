const mongoose = require('mongoose');
const Payments = require("../models/payments");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");


const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID;
const SALT_KEY = process.env.PHONEPE_SALT_KEY;
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX;
const PHONE_PE_HOST_URL = process.env.PHONEPE_API_URL;
const APP_BE_URL  = process.env.REDIRECT_URL_SUCCESS;

// Initiate Payment
exports.initiatePayment = async (req, res) => {

    const {amount} = req.body;

    // User ID is the ID of the user present in our application DB
    let userId = "MUID123";

    // Generate a unique merchant transaction ID for each transaction
    let merchantTransactionId = uniqid();

    // redirect url => phonePe will redirect the user to this url once payment is completed. It will be a GET request, since redirectMode is "REDIRECT"
    let normalPayLoad = {
        merchantId: MERCHANT_ID, //* PHONEPE_MERCHANT_ID . Unique for each account (private)
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100, // converting to paise
        redirectUrl: `${APP_BE_URL}/${merchantTransactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber: "9999999999",
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    // make base64 encoded payload
    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    let base64EncodedPayload = bufferObj.toString("base64");

    // X-VERIFY => SHA256(base64EncodedPayload + "/pg/v1/pay" + SALT_KEY) + ### + SALT_INDEX
    let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    axios
        .post(
        `${PHONE_PE_HOST_URL}/pg/v1/pay`,
        {
            request: base64EncodedPayload,
        },
        {
            headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyChecksum,
            accept: "application/json",
            },
        }
        )
    .then(function (response) {
      console.log("response->", JSON.stringify(response.data));
        res.json({
            success: true,
            redirectUrl: response.data.data.instrumentResponse.redirectInfo.url
        });
      //res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      res.send(error);
    });
};

// Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
    const { merchantTransactionId } = req.params;

    if (merchantTransactionId) {
        let statusUrl =
        `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/` +
        merchantTransactionId;

        // generate X-VERIFY
        let string =
        `/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + SALT_KEY;
        let sha256_val = sha256(string);
        let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

        axios
        .get(statusUrl, {
            headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyChecksum,
            "X-MERCHANT-ID": merchantTransactionId,
            accept: "application/json",
            },
        })
        .then(async function (response) {
            console.log("response->", response.data);
            if (response.data && response.data.code === "PAYMENT_SUCCESS") {
                // redirect to FE payment success status page

                const payment = new Payments({
                    transactionId: response.data.data.transactionId,
                    amount: response.data.data.amount,
                    currency: "inr",
                    paymentStatus: response.data.data.responseCode,
                    paymentMethod: response.data.data.paymentInstrument?.type || "Phone Pay",
                });
                
                await payment.save();

                res.send(response.data);
            } else {
                // redirect to FE payment failure / pending status page
                res.status(500).json({ success: false, error: response.data.message });
            }
        })
        .catch(function (error) {
            // redirect to FE payment failure / pending status page
            res.send(error);
        });
    } else {
        res.send("Sorry!! Error");
    }
};