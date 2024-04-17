const mongoose = require("mongoose");

const tipsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },

  tips: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "processing",
  },
});

const ProductTips = mongoose.model("ProductTips", tipsSchema);

module.exports = ProductTips;
