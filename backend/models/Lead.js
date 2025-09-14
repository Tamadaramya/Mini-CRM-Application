const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer ID is required']
  },
  title: {
    type: String,
    required: [true, 'Lead title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Lead description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['New', 'Contacted', 'Converted', 'Lost'],
      message: 'Status must be one of: New, Contacted, Converted, Lost'
    },
    default: 'New'
  },
  value: {
    type: Number,
    required: [true, 'Lead value is required'],
    min: [0, 'Value cannot be negative']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);