const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { extend } = require("lodash");
const { paramLogger } = require("../middleware/middleware");
// const { checkAuth } = require("../middleware/middleware");
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");

let userCartRouter = express.Router({ mergeParams: true });
router.use("/:userId/cart", userCartRouter);

let userWishlistRouter = express.Router({ mergeParams: true });
router.use("/:userId/wishlist", userWishlistRouter);

router.use("/:userId", paramLogger);
// router.use("/:id", checkAuth);

router.route("/")
  .get(async (req, res) => {
    try {
      const users = await User.find({});
      res.json({ success: true, users });
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Unable to get users", errorMessage: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const user = req.body;
      if (!(user.email && user.password && user.name)) {
        return res
          .status(400)
          .json({ success: false, message: "Data not formatted properly" });
      }
      const NewUser = new User(user);
      const salt = await bcrypt.genSalt(10);
      NewUser.password = await bcrypt.hash(NewUser.password, salt);
      const savedUser = await NewUser.save();
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET
      );
      res.json({
        success: true,
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
        },
        token,
      });
    }
    catch (error) {
      res.status(500).json({ success: false, message: "Unable to register user", errorMessage: error.message });
    }
  })

router.param("userId", async (req, res, next, userId) => {
  try {
    const user = await User.findById(userId);
    console.log("User ID: ", userId);
    if (!user) {
      return res.status(400).json({ success: false, message: "Error getting user" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error while retreiving the user" });
  }
})

router.route("/:userId")
  .get(async (req, res) => {
    console.log("Params Checked", req.paramsChecked);
    const { user } = req;
    res.json({ success: true, user });
  })
  .post(async (req, res) => {
    const userUpdates = req.body;
    let { user } = req;
    user = extend(user, userUpdates);
    user = await user.save();
    // if made undefined, the property does not get passed into the json
    user.__v = undefined;
    res.json({ success: true, user });
  })
  .delete(async (req, res) => {
    let { user } = req;
    user = await user.remove();
    res.json({ success: true, message: "User deleted successfully", user, deleted: true });
  })

userCartRouter.route("/")
  .get((req, res) => {
    const { userId } = req.params;
    User.findById(userId).populate("cart.product").exec((error, user) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while retreiving cart", errorMessage: error.message });
      }
      return res.json({ success: true, cart: user.cart })
    });
  });

userWishlistRouter.route("/")
  .get((req, res) => {
    const { userId } = req.params;
    User.findById(userId).populate("wishlist").exec((error, user) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error while retreiving wishlist", errorMessage: error.message });
      }
      return res.json({ success: true, wishlist: user.wishlist })
    });
  });


module.exports = router;