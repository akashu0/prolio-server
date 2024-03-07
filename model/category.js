const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  product_type: {
    type: String,
    required: true,
    unique: true,
  },

  category: [
    {
      categoryName: {
        type: String,
        required: true,
      },
      subcategoryName: [
        {
          type: String,
          required: true,
        },
      ],
      fields: [
        {
          name: {
            type: String,
          },
          status: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
