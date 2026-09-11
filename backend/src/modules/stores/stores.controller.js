const storesService = require('./stores.service');
const ApiResponse = require('../../utils/ApiResponse');


const adminCreateStore = async (req, res, next) => {
  try {
    const store = await storesService.createStore(req.body);
    return ApiResponse.created(res, 'Store created successfully', { store });
  } catch (error) {
    next(error);
  }
};

const adminGetAllStores = async (req, res, next) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;
    const stores = await storesService.getAllStoresAdmin({ name, email, address, sortBy, sortOrder });
    return ApiResponse.success(res, 'Stores retrieved successfully', {
      stores,
      count: stores.length,
    });
  } catch (error) {
    next(error);
  }
};


const getAllStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const stores = await storesService.getAllStoresUser(
      { name, address, sortBy, sortOrder },
      req.user.id
    );
    return ApiResponse.success(res, 'Stores retrieved successfully', {
      stores,
      count: stores.length,
    });
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const store = await storesService.getStoreById(req.params.id, req.user.id);
    return ApiResponse.success(res, 'Store retrieved successfully', { store });
  } catch (error) {
    next(error);
  }
};

module.exports = { adminCreateStore, adminGetAllStores, getAllStores, getStoreById };
