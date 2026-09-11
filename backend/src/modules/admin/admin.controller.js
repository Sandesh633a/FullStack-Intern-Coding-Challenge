const adminService = require('./admin.service');
const ApiResponse = require('../../utils/ApiResponse');

const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return ApiResponse.success(res, 'Dashboard statistics retrieved successfully', { stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
