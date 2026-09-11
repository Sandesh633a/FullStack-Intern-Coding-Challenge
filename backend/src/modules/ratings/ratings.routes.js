const { Router } = require('express');
const ratingsController = require('./ratings.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/authorize');
const { validate } = require('../../middleware/validate');
const { ratingValidator, uuidParamValidator } = require('../../utils/validators');

const router = Router();

router.use(authenticate, authorize('user'));

/**
 * @route   POST /api/ratings/:storeId
 * @desc    Submit a rating for a store (1-5)
 * @access  User
 */
router.post(
  '/:storeId',
  [uuidParamValidator('storeId'), ratingValidator()],
  validate,
  ratingsController.submitRating
);

/**
 * @route   PATCH /api/ratings/:storeId
 * @desc    Update an existing rating for a store
 * @access  User
 */
router.patch(
  '/:storeId',
  [uuidParamValidator('storeId'), ratingValidator()],
  validate,
  ratingsController.updateRating
);

module.exports = router;
