const mongoose = require("mongoose");

const faqsSchema = new mongoose.Schema({
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

  companyId: {
    type: String,
    required: true,
  },

  questions: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
  },
  status: {
    type: String,
    default: "processing",
  },
});

const faqs = mongoose.model("faqs", faqsSchema);

module.exports = faqs;
