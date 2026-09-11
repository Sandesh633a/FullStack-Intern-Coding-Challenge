const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/env');
const { queryRaw } = require('../config/db');
const ApiError = require('../utils/ApiError');


//Middleware, Verify JWT and attach user to request.
 
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No token provided'));
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    try {
      decoded = jwt.verify(token, jwtConfig.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token has expired'));
      }
      return next(ApiError.unauthorized('Invalid token'));
    }

    const result = await queryRaw(
      'SELECT id, name, email, address, role FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return next(ApiError.unauthorized('User no longer exists'));
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate };
