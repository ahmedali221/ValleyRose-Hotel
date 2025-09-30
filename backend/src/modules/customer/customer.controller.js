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
  const doc = await Customer.create(req.body);
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

module.exports = { createValidators, createCustomer, listCustomers, getCustomer, updateCustomer, deleteCustomer };


