const { queryRaw } = require('../../config/db');
const ApiError = require('../../utils/ApiError');


const createStore = async ({ name, email, address, owner_id }) => {
  if (owner_id) {
    const ownerResult = await queryRaw(
      `SELECT id, role FROM users WHERE id = $1`,
      [owner_id]
    );
    if (ownerResult.rows.length === 0) {
      throw ApiError.notFound('Owner user not found');
    }
    if (ownerResult.rows[0].role !== 'store_owner') {
      throw ApiError.badRequest('The specified user is not a store_owner');
    }
  }

  const result = await queryRaw(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, address, owner_id, created_at`,
    [name, email, address, owner_id || null]
  );

  return result.rows[0];
};


const getAllStoresAdmin = async ({ name, email, address, sortBy, sortOrder = 'ASC' }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    conditions.push(`s.name ILIKE $${paramIndex++}`);
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push(`s.email ILIKE $${paramIndex++}`);
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push(`s.address ILIKE $${paramIndex++}`);
    params.push(`%${address}%`);
  }

  const allowedSortFields = {
    name: 's.name',
    email: 's.email',
    address: 's.address',
    average_rating: 'average_rating',
    created_at: 's.created_at',
  };
  const allowedSortOrders = ['ASC', 'DESC'];
  const safeSortBy = allowedSortFields[sortBy] || 's.created_at';
  const safeSortOrder = allowedSortOrders.includes(sortOrder?.toUpperCase())
    ? sortOrder.toUpperCase()
    : 'ASC';

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      s.owner_id,
      u.name AS owner_name,
      ROUND(AVG(r.rating)::numeric, 2) AS average_rating,
      COUNT(r.id) AS total_ratings,
      s.created_at
    FROM stores s
    LEFT JOIN users u ON u.id = s.owner_id
    LEFT JOIN ratings r ON r.store_id = s.id
    ${where}
    GROUP BY s.id, u.name
    ORDER BY ${safeSortBy} ${safeSortOrder}
  `;

  const result = await queryRaw(query, params);
  return result.rows;
};


const getAllStoresUser = async ({ name, address, sortBy, sortOrder = 'ASC' }, userId) => {
  const conditions = [];
  const params = [userId];
  let paramIndex = 2;

  if (name) {
    conditions.push(`s.name ILIKE $${paramIndex++}`);
    params.push(`%${name}%`);
  }
  if (address) {
    conditions.push(`s.address ILIKE $${paramIndex++}`);
    params.push(`%${address}%`);
  }

  const allowedSortFields = {
    name: 's.name',
    address: 's.address',
    average_rating: 'average_rating',
  };
  const allowedSortOrders = ['ASC', 'DESC'];
  const safeSortBy = allowedSortFields[sortBy] || 's.name';
  const safeSortOrder = allowedSortOrders.includes(sortOrder?.toUpperCase())
    ? sortOrder.toUpperCase()
    : 'ASC';

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      ROUND(AVG(r.rating)::numeric, 2) AS average_rating,
      COUNT(r.id) AS total_ratings,
      my_r.rating AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    LEFT JOIN ratings my_r ON my_r.store_id = s.id AND my_r.user_id = $1
    ${where}
    GROUP BY s.id, my_r.rating
    ORDER BY ${safeSortBy} ${safeSortOrder}
  `;

  const result = await queryRaw(query, params);
  return result.rows;
};


const getStoreById = async (storeId, userId = null) => {
  const result = await queryRaw(
    `SELECT
       s.id, s.name, s.email, s.address, s.owner_id,
       u.name AS owner_name,
       ROUND(AVG(r.rating)::numeric, 2) AS average_rating,
       COUNT(r.id) AS total_ratings
     FROM stores s
     LEFT JOIN users u ON u.id = s.owner_id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id, u.name`,
    [storeId]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('Store not found');
  }

  const store = result.rows[0];

  if (userId) {
    const myRating = await queryRaw(
      'SELECT rating FROM ratings WHERE store_id = $1 AND user_id = $2',
      [storeId, userId]
    );
    store.user_rating = myRating.rows.length > 0 ? myRating.rows[0].rating : null;
  }

  return store;
};

module.exports = { createStore, getAllStoresAdmin, getAllStoresUser, getStoreById };
