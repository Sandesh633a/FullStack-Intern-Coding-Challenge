const { queryRaw } = require('../../config/db');
const ApiError = require('../../utils/ApiError');


const getOwnerDashboard = async (ownerId) => {
  const storeResult = await queryRaw(
    `SELECT id, name, email, address FROM stores WHERE owner_id = $1`,
    [ownerId]
  );

  if (storeResult.rows.length === 0) {
    throw ApiError.notFound('No store found for this owner');
  }

  const dashboards = await Promise.all(
    storeResult.rows.map(async (store) => {
      const ratingsResult = await queryRaw(
        `SELECT
           r.id AS rating_id,
           r.rating,
           r.created_at AS rated_at,
           r.updated_at AS updated_at,
           u.id AS user_id,
           u.name AS user_name,
           u.email AS user_email
         FROM ratings r
         JOIN users u ON u.id = r.user_id
         WHERE r.store_id = $1
         ORDER BY r.created_at DESC`,
        [store.id]
      );

      const ratings = ratingsResult.rows;
      const avgRating =
        ratings.length > 0
          ? parseFloat(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
            )
          : null;

      return {
        ...store,
        average_rating: avgRating,
        total_ratings: ratings.length,
        raters: ratings,
      };
    })
  );

  return dashboards;
};

module.exports = { getOwnerDashboard };
