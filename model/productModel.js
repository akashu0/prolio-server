const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // companyId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref:"companyDetials",
  //   required: true

  // },

  sections: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  
  status: {
    type: String,
    default: "draft",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
