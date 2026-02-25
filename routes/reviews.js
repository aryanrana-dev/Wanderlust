const express = require("express");
const router = express.Router({mergeParams: true});
const { IsLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

//Create review
router.post("/", IsLoggedIn, validateReview, reviewController.createReview);

//Delete review
router.delete("/:reviewId", IsLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;