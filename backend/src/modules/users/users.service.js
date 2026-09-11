const bcrypt = require('bcryptjs');
const { queryRaw } = require('../../config/db');
const ApiError = require('../../utils/ApiError');


const createUser = async ({ name, email, password, address, role }) => {
  const existing = await queryRaw('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw ApiError.conflict('Email address is already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await queryRaw(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, passwordHash, address, role]
  );
  return result.rows[0];
};


const getAllUsers = async ({ name, email, address, role, sortBy, sortOrder = 'ASC' }) => {
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (name) {
    conditions.push(`name ILIKE $${paramIndex++}`);
    params.push(`%${name}%`);
  }
  if (email) {
    conditions.push(`email ILIKE $${paramIndex++}`);
    params.push(`%${email}%`);
  }
  if (address) {
    conditions.push(`address ILIKE $${paramIndex++}`);
    params.push(`%${address}%`);
  }
  if (role) {
    conditions.push(`role = $${paramIndex++}`);
    params.push(role);
  }

  const allowedSortFields = ['name', 'email', 'address', 'created_at'];
  const allowedSortOrders = ['ASC', 'DESC'];
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const safeSortOrder = allowedSortOrders.includes(sortOrder?.toUpperCase())
    ? sortOrder.toUpperCase()
    : 'ASC';

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, name, email, address, role, created_at
    FROM users
    ${where}
    ORDER BY ${safeSortBy} ${safeSortOrder}
  `;

  const result = await queryRaw(query, params);
  return result.rows;
};


const getUserById = async (userId) => {
  const result = await queryRaw(
    `SELECT id, name, email, address, role, created_at FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  const user = result.rows[0];

  if (user.role === 'store_owner') {
    const storeResult = await queryRaw(
      `SELECT s.id, s.name, s.email, s.address,
              ROUND(AVG(r.rating)::numeric, 2) AS average_rating,
              COUNT(r.id) AS total_ratings
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = $1
       GROUP BY s.id`,
      [userId]
    );
    user.stores = storeResult.rows;
  }

  return user;
};

module.exports = { createUser, getAllUsers, getUserById };
