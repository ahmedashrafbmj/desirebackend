const Review = require('../Model/ReviewModel'); // Assuming your schema is in a 'models' directory

const reviewController = {};

// Create a new review
reviewController.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      return res.status(404).json({ error: 'Review not found' });
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
      return res.status(404).json({ error: 'Review not found' });
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
      const action = req.body.action;
  
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ message: 'review not found' });
      }
  
      if (action === 1) { // Compare action to a number
        review.isApproved = true;
        await review.save();
        return res.json({ message: 'review approved successfully' });
      } else if (action === 0) { // Compare action to a number
        review.isApproved = false;
        await review.save();
        return res.json({ message: 'review rejected successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to approve/reject review', error: error.message });
    }
  };
  

// Get reviews by ProductId
reviewController.getReviewsByProductId = async (req, res) => {
  try {
    const { ProductId } = req.params;
    const approvedReviews = await Review.find({ ProductId, isApproved: true });
    res.status(200).json({status:true,data:approvedReviews});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = reviewController;
