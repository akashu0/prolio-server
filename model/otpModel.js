
const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: 300 },
  },
});

const Otp = model("Otp", otpSchema);

module.exports = Otp;