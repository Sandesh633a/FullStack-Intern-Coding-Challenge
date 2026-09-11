const { nodeEnv } = require('../config/env');
const ApiError = require('../utils/ApiError');


const errorHandler = (err, req, res, next) => {
  if (nodeEnv === 'development') {
    console.error('Error:', err);
  }

  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message,
    };
    if (err.errors && err.errors.length > 0) {
      response.errors = err.errors;
    }
    return res.status(err.statusCode).json(response);
  }

  if (err.code === '23505') {
    const detail = err.detail || '';
    let message = 'A resource with that value already exists';
    if (detail.includes('email')) message = 'Email address is already in use';
    return res.status(409).json({ success: false, message });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Referenced resource does not exist',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = nodeEnv === 'production' ? 'Internal server error' : err.message;

  return res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };
