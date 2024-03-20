const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companyDetials",
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },

  message: [
    {
      text: {
        type: String,
      },

      from: {
        type: String,
        default: "user",
      },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;
