const express = require("express");
const router = express.Router();
const shortid = require("shortid");
const { Product } = require("../models/product.model");

const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.route("/razorpay").post(async (req, res) => {
  try {
    const { products } = req.body;
    const productDetails = [];
    for (let i = 0; i < products.length; i++) {
      const product = await Product.findById(products[i].productId);
      productDetails.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        qty: products[i].qty,
      });
    }
    let amount = 0;
    const currency = "INR";
    const payment_capture = 1;

    amount = productDetails.reduce(
      (acc, curr) => acc + curr.price * curr.qty,
      0
    );

    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const orderResponse = await razorpay.orders.create(options);
    res.json({
      id: orderResponse.id,
      currency: orderResponse.currency,
      amount: orderResponse.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      errorMessage: "Payment couldn't be fulfilled",
      message: "Payment couldn't be fulfilled",
    });
  }
});

module.exports = router;
