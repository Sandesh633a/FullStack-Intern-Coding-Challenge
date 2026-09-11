const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return ApiResponse.created(res, 'Registration successful', { user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    return ApiResponse.success(res, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user.id, req.body);
    return ApiResponse.success(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, changePassword };
