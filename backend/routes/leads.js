const express = require('express');
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');
const { validateLead } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getLeads)
  .post(validateLead, createLead);

router.route('/:id')
  .get(getLead)
  .put(validateLead, updateLead)
  .delete(deleteLead);

module.exports = router;