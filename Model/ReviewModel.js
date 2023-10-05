const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  reviewComment: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  number: {
    type: String,
    required: [true, "Number is required"],
  },
  rating: {
    type: String,
    required: [true, "message is Required"],
  },
  ProductId: {
    type: String,
    required: [true, "ProductId is Required"],
  },
  images: [
    {
      type: String,
      required: [true, "images are Required"],
    },
  ],
  isApproved: {
    type: Boolean,
    default: false, // Initially, a review is not approved
  },
  // video: {
  //   type: String,
  //   required: [true, "video is Required"],
  // },
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
