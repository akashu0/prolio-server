const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true, 
  },
  category: {
    type: String,
    required: true,
  },
  subcategories: [
    {
      type: String,
    },
  ],

  questions: {
    type: mongoose.Schema.Types.Mixed,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
