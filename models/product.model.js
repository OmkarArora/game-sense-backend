const mongoose = require("mongoose");
require('mongoose-type-url');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: "Cannot create a product without a `name` field"
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      code: { type: String, required: true },
      symbol: { type: String, required: true },
    },
    rating: {
      type: Number,
      required: true
    },
    coverImage: {
      type: mongoose.SchemaTypes.Url,
      required: "Product needs a cover image"
    },
    gallery: [
      {type: mongoose.SchemaTypes.Url}
    ],
    description: {
      type: String,
      minLength: [100, "Description should be atleast 100 characters long"]
    },
    category: {
      type: String,
      enum: ["game", "peripheral"],
      default: "game",
      required: "Product needs a category of - `game` or `peripheral`"
    },
    platforms: [
      {
        type: String,
        enum: ["PS4", "PS5", "Xbox One | X", "Xbox Series X | S", "Windows 10"],
        default: "PS5",
        required: true
      }
    ],
    page: {
      type: String,
      enum: ["home", "xbox", "playstation"]
    },
    discountOffer: {
      discountType: {
        type: String,
        enum: ["percent", "absolute"],
        default: "percent"
      },
      amount: {
        type: Number,
        required: "Discount amount is required"
      }
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = { Product };