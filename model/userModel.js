const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
  },
  isGoogleLogin: {
    type: Boolean,
    default: false
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
  userImg: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  departments: {
    type: mongoose.Schema.Types.Mixed,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companyDetials",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
