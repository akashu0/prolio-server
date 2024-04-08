const mongoose = require("mongoose");

const TypeSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      required: true,
      unique: true,
    },
    steps: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TypeModel = mongoose.model("Type", TypeSchema);

module.exports = TypeModel;
