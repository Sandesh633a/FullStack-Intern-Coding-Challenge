const { Router } = require('express');
const storesController = require('./stores.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/authorize');
const { validate } = require('../../middleware/validate');
const { createStoreValidators, uuidParamValidator } = require('../../utils/validators');

const adminRouter = Router();
adminRouter.use(authenticate, authorize('admin'));

/**
 * @route   POST /api/admin/stores
 * @desc    Admin: Create a new store
 * @access  Admin
 */
adminRouter.post('/', createStoreValidators, validate, storesController.adminCreateStore);

/**
 * @route   GET /api/admin/stores
 * @desc    Admin: List all stores with filters, average ratings
 * @access  Admin
 * @query   name, email, address, sortBy, sortOrder
 */
adminRouter.get('/', storesController.adminGetAllStores);

const userRouter = Router();
userRouter.use(authenticate);

/**
 * @route   GET /api/stores
 * @desc    Get all stores with average rating and user's own rating
 * @access  Authenticated (all roles)
 * @query   name, address, sortBy, sortOrder
 */
userRouter.get('/', storesController.getAllStores);

/**
 * @route   GET /api/stores/:id
 * @desc    Get a single store's details
 * @access  Authenticated (all roles)
 */
userRouter.get('/:id', [uuidParamValidator('id')], validate, storesController.getStoreById);

module.exports = { adminRouter, userRouter };
