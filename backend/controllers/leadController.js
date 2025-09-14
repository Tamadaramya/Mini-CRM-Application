const Lead = require('../models/Lead');
const Customer = require('../models/Customer');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;

    // Build query - get leads for customers owned by current user
    const customerIds = await Customer.find({ ownerId: req.user.id }).select('_id');
    const customerIdArray = customerIds.map(customer => customer._id);

    let query = { customerId: { $in: customerIdArray } };

    // Filter by status if provided
    if (status && status !== 'all' && status !== '') {
      query.status = status;
    }

    // Execute query with pagination
    const leads = await Lead.find(query)
      .populate('customerId', 'name email company')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count for pagination
    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message
    });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('customerId', 'name email company');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findById(lead.customerId._id);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this lead'
      });
    }

    res.json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
      error: error.message
    });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { customerId, title, description, status, value } = req.body;

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({
      _id: customerId,
      ownerId: req.user.id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found or not authorized'
      });
    }

    // Create lead with owner ID
    const leadData = {
      customerId,
      title,
      description,
      status: status || 'New',
      value,
      ownerId: req.user.id
    };

    const lead = await Lead.create(leadData);

    // Populate customer data for response
    await lead.populate('customerId', 'name email company');

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: error.message
    });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lead'
      });
    }

    // If customerId is being updated, verify the new customer belongs to user
    if (req.body.customerId && req.body.customerId !== lead.customerId.toString()) {
      const newCustomer = await Customer.findOne({
        _id: req.body.customerId,
        ownerId: req.user.id
      });

      if (!newCustomer) {
        return res.status(404).json({
          success: false,
          message: 'New customer not found or not authorized'
        });
      }
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customerId', 'name email company');

    res.json({
      success: true,
      data: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message
    });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if user owns the customer associated with this lead
    const customer = await Customer.findById(lead.customerId);
    if (!customer || customer.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this lead'
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
};

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead
};