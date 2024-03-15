const mongoose = require("mongoose");

const companyDetialsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  OwnerName: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  yearOfRegister: {
    type: String,
    required: true,
  },

  businessType: {
    type: String,
    required: true,
  },
  totalEmployees: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  is_verfied: {
    type: Boolean,
    default: false,
  },
  documents: [
    {
      type: String,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    default: "Active",
  },
});

const companyDetials = mongoose.model("companyDetials", companyDetialsSchema);
module.exports = companyDetials;
