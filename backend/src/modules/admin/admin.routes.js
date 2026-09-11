const { Router } = require('express');
const adminController = require('./admin.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate, authorize('admin'));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Admin: Get platform statistics (total users, stores, ratings)
 * @access  Admin
 */
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
