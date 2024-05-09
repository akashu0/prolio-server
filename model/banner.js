const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "active",
  },
  description: {
    type: String,
    trim: true,
  },
  descriptionColor: {
    type:String
  }
});

const Banners = mongoose.model("Banner", imageSchema);

module.exports = Banners;
