const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, "category is required"],
  },
  brand: {
    type: String,
    required: [true, "brand is required"],
  },
  price: {
    type: String,
    required: [true, "price is required"],
  },
  discountedPrice: {
    type: String,
    required: [true, "discountedPrice is required"],
  },
  menuProductNumber: {
    type: Number,
  },
  unitsolds: {
    type: String,
    required: [true, "unitsolds is Required"],
  },
  totalUnits: {
    type: String,
    required: [true, "totalUnits is Required"],
  },
  longDescription: {
    type: String,
    required: [true, "longDescription is Required"],
  },
  shortDescription: {
    type: String,
    required: [true, "shortDescription is Required"],
  },
  images: [
    {
      type: String,
      required: [true, "images are Required"],
    },
  ],
  video: {
    type: String,
    required: [true, "video is Required"],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
