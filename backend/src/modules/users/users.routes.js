const { Router } = require('express');
const usersController = require('./users.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/authorize');
const { validate } = require('../../middleware/validate');
const { adminCreateUserValidators, uuidParamValidator } = require('../../utils/validators');

const router = Router();

// All routes require admin role
router.use(authenticate, authorize('admin'));

/**
 * @route   POST /api/admin/users
 * @desc    Admin: Create a new user with any role
 * @access  Admin
 */
router.post('/', adminCreateUserValidators, validate, usersController.createUser);

/**
 * @route   GET /api/admin/users
 * @desc    Admin: List all users with optional filters and sorting
 * @access  Admin
 * @query   name, email, address, role, sortBy, sortOrder
 */
router.get('/', usersController.getAllUsers);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Admin: Get a specific user's details
 * @access  Admin
 */
router.get('/:id', [uuidParamValidator('id')], validate, usersController.getUserById);

module.exports = router;
