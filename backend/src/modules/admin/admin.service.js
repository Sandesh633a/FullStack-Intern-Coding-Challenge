const { queryRaw } = require('../../config/db');


// Admin: Get platform-wide statistics.
 
const getDashboardStats = async () => {
  const [usersResult, storesResult, ratingsResult] = await Promise.all([
    queryRaw('SELECT COUNT(*) AS total_users FROM users'),
    queryRaw('SELECT COUNT(*) AS total_stores FROM stores'),
    queryRaw('SELECT COUNT(*) AS total_ratings FROM ratings'),
  ]);

  return {
    total_users: parseInt(usersResult.rows[0].total_users),
    total_stores: parseInt(storesResult.rows[0].total_stores),
    total_ratings: parseInt(ratingsResult.rows[0].total_ratings),
  };
};

module.exports = { getDashboardStats };
