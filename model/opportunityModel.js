const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema({
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

  formData: {
    type: mongoose.Schema.Types.Mixed,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

module.exports = Opportunity;
