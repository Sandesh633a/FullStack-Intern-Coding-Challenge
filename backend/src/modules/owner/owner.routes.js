const { Router } = require('express');
const ownerController = require('./owner.controller');
const { authenticate } = require('../../middleware/auth');
const { authorize } = require('../../middleware/authorize');

const router = Router();

router.use(authenticate, authorize('store_owner'));

/**
 * @route   GET /api/owner/dashboard
 * @desc    Store owner: View their store's ratings and average
 * @access  Store Owner
 */
router.get('/dashboard', ownerController.getDashboard);

module.exports = router;
