const express = require("express");
const router = express.Router();
// const { checkAuth } = require("../middleware/middleware");
const { Product } = require("../models/product.model");

router.route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({ $or: [{ platforms: "PS5" }, { platforms: "PS4" }] });
      products.forEach(item => item.__v = undefined);
      res.json({ success: true, products });
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Unable to get products", errorMessage: error.message });
    }
  })

module.exports = router;