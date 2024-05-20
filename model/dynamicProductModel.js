const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategories: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  images: [
    
  ],
  questions: {
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
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Item", productSchema);

module.exports = Product;
