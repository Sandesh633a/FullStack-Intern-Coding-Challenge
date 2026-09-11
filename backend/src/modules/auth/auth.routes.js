const { Router } = require('express');
const authController = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const {
  registerValidators,
  loginValidators,
  changePasswordValidators,
} = require('../../utils/validators');

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (role = user)
 * @access  Public
 */
router.post('/register', registerValidators, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login for all roles
 * @access  Public
 */
router.post('/login', loginValidators, validate, authController.login);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change own password
 * @access  Authenticated
 */
router.patch(
  '/change-password',
  authenticate,
  changePasswordValidators,
  validate,
  authController.changePassword
);

module.exports = router;
