const mongoose = require("mongoose");

const typecategorySchema = new mongoose.Schema({
  type: {
    type: String,
  },
  status: {
    type: String,
    default: "Active",
  },
  category: {
    type: String,
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

const TypeCategory = mongoose.model("TypeCategory", typecategorySchema);

module.exports = TypeCategory;
