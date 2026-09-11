const ownerService = require('./owner.service');
const ApiResponse = require('../../utils/ApiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await ownerService.getOwnerDashboard(req.user.id);
    return ApiResponse.success(res, 'Dashboard retrieved successfully', { stores: dashboard });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
