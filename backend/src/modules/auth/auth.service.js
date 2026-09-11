const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { queryRaw } = require('../../config/db');
const { jwt: jwtConfig } = require('../../config/env');
const ApiError = require('../../utils/ApiError');


const register = async ({ name, email, password, address }) => {
  const existing = await queryRaw('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw ApiError.conflict('Email address is already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await queryRaw(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, 'user')
     RETURNING id, name, email, address, role, created_at`,
    [name, email, passwordHash, address]
  );

  return result.rows[0];
};


const login = async ({ email, password }) => {
  const result = await queryRaw('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};


const changePassword = async (userId, { currentPassword, newPassword }) => {
  const result = await queryRaw('SELECT password FROM users WHERE id = $1', [userId]);
  if (result.rows.length === 0) {
    throw ApiError.notFound('User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const newHash = await bcrypt.hash(newPassword, 12);
  await queryRaw(
    'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
    [newHash, userId]
  );
};

module.exports = { register, login, changePassword };
