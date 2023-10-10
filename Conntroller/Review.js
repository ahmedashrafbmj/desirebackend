const Post = require("../Model/ProductSchema");
const Review = require("../Model/ReviewModel"); // Assuming your schema is in a 'models' directory
const { sendResponse } = require("../helper/helper");
const reviewController = {};

// Create a new review
reviewController.createReview = async (req, res) => {
  try {
    const {
      name,
      reviewTitle,
      reviewComment,
      email,
      number,
      message,
      ProductId,
      rating,
    } = req.body;
    console.log(req, "req.files");
    const imageFileNames = req.files.map((file) => file.filename);
    const existedProduct = await Post.findById({ _id: ProductId });
    if (existedProduct) {
      console.log({ ProductId });
      const newReview = new Review({
        name,
        reviewTitle,
        reviewComment,
        email,
        rating,
        number,
        message,
        ProductId,

        images: imageFileNames,
      });
      const savedReview = await newReview.save();
      res.status(201).json(savedReview);
    }
  } catch (error) {
    res
      .status(400)
      .json({ message: "There is no product", error: error.message });
    console.log(error);
  }
};

// Get all reviews
reviewController.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single review by ID
reviewController.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a review by ID
reviewController.updateReviewById = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve and reject a review by ID
reviewController.ApproveandRejectReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .send(sendResponse(false, null, "review not found"));
    }
    review.isApproved = req.body.isApproved; // Assuming you send the boolean value in the request body
    await review.save();

    return res.send(
      sendResponse(true, review, "review status updated successfully")
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send(sendResponse(false, null, "Internal Server Error"));
  }
};

// Get reviews by ProductId
reviewController.getReviewsByProductId = async (req, res) => {
  try {
    const { ProductId } = req.params;
    // const approvedReviews = await Review.find({ ProductId, isApproved: true });
    const approvedReviews = await Review.find({ ProductId });
    const baseUrl = "http://localhost:3000/uploads/"; // Replace with your actual base URL
    const imagesWithBaseUrl = approvedReviews?.images?.map(
      (image) => baseUrl + image
    );

    // Update the result with the new image URLs
    approvedReviews.images = imagesWithBaseUrl;

    res.status(200).json({ status: true, data: approvedReviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete reviews
reviewController.deleteReview = async (req, res) => {
  let reviewId = req.params.reviewId;
  let result = await Review.findById(reviewId);

  if (!result) {
    res.send(sendResponse(false, null, "Data Not Found")).status(404);
  } else {
    let deleResult = await Review.findByIdAndDelete(reviewId);
    if (!deleResult) {
      res.send(sendResponse(false, null, "Data Not Deleted")).status(400);
    } else {
      res.send(sendResponse(true, deleResult, "Data Deleted")).status(200);
    }
  }
};

module.exports = reviewController;
