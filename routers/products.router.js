const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { paramLogger } = require("../middleware/middleware");
// const { checkAuth } = require("../middleware/middleware");
const { Product } = require("../models/product.model");

router.use("/:productId", paramLogger);
// router.use("/:id", checkAuth);

router.route("/")
  .get(async (req, res) => {
    try {
      const products = await Product.find({});
      products.forEach(item => item.__v = undefined);
      res.json({ success: true, products });
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Unable to get products", errorMessage: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const product = req.body;
      const NewProduct = new Product(product);
      const savedProduct = await NewProduct.save();
      res.json({ success: true, product: savedProduct });
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Unable to add products", errorMessage: error.message });
    }
  })

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    console.log("Product ID: ", productId);
    if (!product) {
      return res.status(400).json({ success: false, message: "Error getting product" });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error while retreiving the product" });
  }
})

router.route("/:productId")
  .get(async (req, res) => {
    console.log("Params Checked", req.paramsChecked);
    const { product } = req;
    // if made undefined, the property does not get passed into the json
    product.__v = undefined;
    res.json({ success: true, product });
  })
  .post(async (req, res) => {
    const productUpdates = req.body;
    let { product } = req;
    product = extend(product, productUpdates);
    product = await product.save();
    res.json({ success: true, product });
  })
  .delete(async (req, res) => {
    let { product } = req;
    product = await product.remove();
    res.json({ success: true, message: "Product deleted successfully", product, deleted: true });
  })

module.exports = router;