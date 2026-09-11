const { body, param, query } = require('express-validator');

const nameValidator = (field = 'name') =>
  body(field)
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters');

const emailValidator = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail();

const passwordValidator = (field = 'password') =>
  body(field)
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain at least one special character');

const addressValidator = (field = 'address') =>
  body(field)
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters');

const ratingValidator = () =>
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5');

const uuidParamValidator = (paramName = 'id') =>
  param(paramName)
    .isUUID().withMessage(`Invalid ${paramName} format`);





    
const registerValidators = [
  nameValidator(),
  emailValidator(),
  passwordValidator(),
  addressValidator(),
];

const loginValidators = [
  emailValidator(),
  body('password').notEmpty().withMessage('Password is required'),
];

const changePasswordValidators = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  passwordValidator('newPassword'),
];

const adminCreateUserValidators = [
  nameValidator(),
  emailValidator(),
  passwordValidator(),
  addressValidator(),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'user', 'store_owner']).withMessage("Role must be 'admin', 'user', or 'store_owner'"),
];

const createStoreValidators = [
  nameValidator('name'),
  emailValidator('email'),
  addressValidator('address'),
  body('owner_id')
    .optional()
    .isUUID().withMessage('owner_id must be a valid UUID'),
];

module.exports = {
  nameValidator,
  emailValidator,
  passwordValidator,
  addressValidator,
  ratingValidator,
  uuidParamValidator,
  registerValidators,
  loginValidators,
  changePasswordValidators,
  adminCreateUserValidators,
  createStoreValidators,
};
