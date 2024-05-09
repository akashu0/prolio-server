// models/Wishlist.js
const mongoose = require("mongoose");

const accessSchema = new mongoose.Schema({
  createdBy: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],

  fetaure: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const Access = mongoose.model("Access", accessSchema);

module.exports = Access;
