const { queryRaw } = require('../../config/db');
const ApiError = require('../../utils/ApiError');


const submitRating = async (userId, storeId, rating) => {
  const storeResult = await queryRaw('SELECT id FROM stores WHERE id = $1', [storeId]);
  if (storeResult.rows.length === 0) {
    throw ApiError.notFound('Store not found');
  }

  const existing = await queryRaw(
    'SELECT id FROM ratings WHERE store_id = $1 AND user_id = $2',
    [storeId, userId]
  );
  if (existing.rows.length > 0) {
    throw ApiError.conflict(
      'You have already rated this store. Use PATCH to update your rating.'
    );
  }

  const result = await queryRaw(
    `INSERT INTO ratings (store_id, user_id, rating)
     VALUES ($1, $2, $3)
     RETURNING id, store_id, user_id, rating, created_at`,
    [storeId, userId, rating]
  );

  return result.rows[0];
};


const updateRating = async (userId, storeId, rating) => {
  const storeResult = await queryRaw('SELECT id FROM stores WHERE id = $1', [storeId]);
  if (storeResult.rows.length === 0) {
    throw ApiError.notFound('Store not found');
  }

  const result = await queryRaw(
    `UPDATE ratings
     SET rating = $1, updated_at = NOW()
     WHERE store_id = $2 AND user_id = $3
     RETURNING id, store_id, user_id, rating, updated_at`,
    [rating, storeId, userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('You have not rated this store yet. Use POST to submit a rating.');
  }

  return result.rows[0];
};

module.exports = { submitRating, updateRating };
