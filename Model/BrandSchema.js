const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is Required"],
  },
  link: {
    type: String,
    required: [true, "link is Required"],
  },

  images: [
    {
      type: String,
      required: [true, "images are Required"],
    },
  ],
  categories: [
    {
      type: Object,
      required: [true, "categories are Required"],
    },
  ],
});

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;
