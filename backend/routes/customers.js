const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { validateCustomer } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getCustomers)
  .post(validateCustomer, createCustomer);

router.route('/:id')
  .get(getCustomer)
  .put(validateCustomer, updateCustomer)
  .delete(deleteCustomer);

module.exports = router;