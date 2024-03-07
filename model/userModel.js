const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  is_verfied: {
    type: Boolean,
    default: false,
  },

  wishlist: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  oppurtunities: [
    
    {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
