const { body, validationResult } = require('express-validator');
const Customer = require('./customer.model');

const createValidators = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').optional().trim(),
];

async function createCustomer(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  // Log the customer data being sent for creation
  console.log('Creating customer with data:', {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    timestamp: new Date().toISOString()
  });
  
  const doc = await Customer.create(req.body);
  
  // Log successful customer creation
  console.log('Customer created successfully:', {
    customerId: doc._id,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    createdAt: doc.createdAt
  });
  
  res.status(201).json(doc);
}

async function listCustomers(_req, res) {
  const items = await Customer.find().sort({ createdAt: -1 });
  res.json(items);
}

async function getCustomer(req, res) {
  const item = await Customer.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Customer not found' });
  res.json(item);
}

async function updateCustomer(req, res) {
  const item = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Customer not found' });
  res.json(item);
}

async function deleteCustomer(req, res) {
  const item = await Customer.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Customer not found' });
  res.json({ success: true });
}

async function createCustomerPublic(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
  try {
    const doc = await Customer.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    console.error('Public customer creation error:', error);
    res.status(500).json({ message: 'Failed to create customer', error: error.message });
  }
}

module.exports = { createValidators, createCustomer, createCustomerPublic, listCustomers, getCustomer, updateCustomer, deleteCustomer };


