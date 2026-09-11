const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');


//Middleware: Collect express-validator errors and pass to error handler.
 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(ApiError.badRequest('Validation failed', messages));
  }
  next();
};

module.exports = { validate };
