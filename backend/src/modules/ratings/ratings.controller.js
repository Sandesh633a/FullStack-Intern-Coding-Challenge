const ratingsService = require('./ratings.service');
const ApiResponse = require('../../utils/ApiResponse');

const submitRating = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const result = await ratingsService.submitRating(req.user.id, storeId, rating);
    return ApiResponse.created(res, 'Rating submitted successfully', { rating: result });
  } catch (error) {
    next(error);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const { storeId } = req.params;
    const { rating } = req.body;
    const result = await ratingsService.updateRating(req.user.id, storeId, rating);
    return ApiResponse.success(res, 'Rating updated successfully', { rating: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRating, updateRating };
