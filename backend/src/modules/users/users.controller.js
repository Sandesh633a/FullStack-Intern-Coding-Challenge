const usersService = require('./users.service');
const ApiResponse = require('../../utils/ApiResponse');

const createUser = async (req, res, next) => {
  try {
    const user = await usersService.createUser(req.body);
    return ApiResponse.created(res, 'User created successfully', { user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;
    const users = await usersService.getAllUsers({ name, email, address, role, sortBy, sortOrder });
    return ApiResponse.success(res, 'Users retrieved successfully', { users, count: users.length });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    return ApiResponse.success(res, 'User retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUser, getAllUsers, getUserById };
