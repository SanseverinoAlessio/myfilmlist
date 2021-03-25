const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/review.js');
const verifyToken = require('../middleware/verifyToken.js');
const filmIsInList = require('../middleware/filmIsInList.js');
const idValidation = require('../middleware/idValidation.js');
const isAdmin = require('../middleware/isAdmin.js');
router.get('/userReview',verifyToken(),reviewController.reviews);
router.get('/userReview/search/:query',verifyToken(),reviewController.userReviewsSearch);
router.get("",reviewController.getReviews);
router.post("/:filmid",idValidation(), verifyToken(),filmIsInList(), reviewController.createReview);
router.delete("/userReview/:filmid",idValidation(),verifyToken(),reviewController.deleteUserReview);
router.put("/:filmid",idValidation(),verifyToken(),reviewController.updateReview);
router.get("/single/:filmid",idValidation(),verifyToken(),reviewController.getReview);
router.delete("/:id",idValidation(),verifyToken(),isAdmin(),reviewController.deleteReview);
router.get("/search/:query",reviewController.reviewSearch);
router.get("/:id",idValidation(),reviewController.getReviewById);

module.exports = router;
