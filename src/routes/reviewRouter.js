const { Router } = require('express');
const reviewController = require('../controllers/reviewController');
const router = Router();

router.post('/review', reviewController.postReview);
router.get('/review/:id', reviewController.getReviewsById);
router.put('/review/:id', reviewController.updateReview);
router.delete('/review/:id', reviewController.deleteReview);


module.exports = router;