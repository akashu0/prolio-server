const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  sections1: {
    type: mongoose.Schema.Types.Mixed,
  },
  sections2: {
    type: mongoose.Schema.Types.Mixed,
  },
  sections3: {
    type: mongoose.Schema.Types.Mixed,
  },
  sections4: {
    type: mongoose.Schema.Types.Mixed,
  },
  
  status: {
    type: String,
    default: "draft",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companyDetials",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companyDetials",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;



