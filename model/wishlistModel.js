// models/Wishlist.js
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
